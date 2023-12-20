//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// pargma experimental ABIEncoderV2 no longer necessary from solidity 0.8.0

// LEARNING:
// - DAO Investment concept
// - Integration of Uniswap as DEX to trade on

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@OpenZeppelin/contracts/security/ReentrancyGuard.sol";

interface IWETH9 {
  function balanceOf(address account) external view returns (uint256);

  function deposit() external payable;

  function withdraw(uint256 wad) external;

  function approve(address guy, uint wad) external returns (bool);
}

contract FundV2 is ReentrancyGuard {
  using SafeMath for uint;

  enum State {
    IDLE,
    CONTRIBUTING,
    TRADING
  }
  State public currentState = State.IDLE;

  struct Asset {
    uint id;
    string sticker;
    address tokenAddress;
    uint lastPrice;
    uint availableFunds;
  }

  struct PoolFee {
    uint24 fee1;
    uint24 fee2;
    uint24 fee3;
  }

  address public owner;
  uint8 public direction;
  bool private protect;

  mapping(uint => address) public investors; // registered investors
  mapping(address => uint) public shares; // shares per investor
  mapping(uint => Asset) public assets; // registered token to  % of Portfolio

  uint public nextInvestorId;
  uint public nextAssetId;
  uint public totalShares;
  uint public minAmount;
  uint public contributionEnd;

  // allows to call functions from the Uniswap Factory contract
  IUniswapV3Factory public immutable SwapV3Factory = IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);

  // allows to call functions from the Uniswap SwapRouter Interface
  ISwapRouter public immutable SwapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

  // we hardcode the token addresses (in production we would use an input parameter for this)
  address public constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab; // WETH on Rinkeby Testnet
  address public constant DAI = 0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa; // DAI on Rinkeby Testnet
  address public constant UNI = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984; // Uniswap on Rinkeby Testnet

  // 1a. Define the admin of the investment contract
  constructor() {
    owner = msg.sender;
  }

  fallback(bytes calldata _input) external payable returns (bytes memory _output) {}

  receive() external payable {}

  // 1b. Seperate initialize() function to reinitialize the contract for trading; not possible if this would be defined in constructor
  function initialize(uint _minAmount, uint duration) external onlyOwner {
    require(currentState == State.IDLE, "State must be idle");
    minAmount = _minAmount;
    contributionEnd = block.timestamp.add(duration);

    currentState = State.CONTRIBUTING;
  }

  // 2. DAO concept; anybody can contribute and will be registered as investor
  function contribute() external payable timeOut nonReentrant {
    require(currentState == State.CONTRIBUTING, "State must be contributing");
    require(msg.value >= minAmount, "You must contribute the minimum amount");
    (bool _success, uint24 _poolFee) = _uniswapV3PoolExists(WETH, DAI);
    require(_success, "Pool does not exist");

    uint256 deadline = block.timestamp.add(15); // using 'now' for convenience, for mainnet pass deadline from frontend!
    address tokenIn = WETH;
    address tokenOut = DAI;
    uint24 fee = _poolFee;
    address recipient = address(this);
    uint256 amountIn = msg.value;
    uint256 amountOutMinimum = 1;
    uint160 sqrtPriceLimitX96 = 0;

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams(
      tokenIn,
      tokenOut,
      fee,
      recipient,
      deadline,
      amountIn,
      amountOutMinimum,
      sqrtPriceLimitX96
    );

    uint amountOut = SwapRouter.exactInputSingle{value: msg.value}(params);

    // an investor can contribute mutiple times; therefore shares neet to be +=;
    investors[nextInvestorId] = msg.sender;
    shares[msg.sender] = shares[msg.sender].add(amountOut);
    totalShares = totalShares.add(amountOut);

    // an address is registered as an investor if it has contributed the min amount once and nextInvestorId will be incremented
    nextInvestorId++;
  }

  // 3. As long as currentState = State.IDLE the owner can cancel the bot and refund the money
  function cancelTradingbot() external onlyOwner {
    require(currentState == State.CONTRIBUTING, "Bot has started trading and can not be cancled");

    _refundInvestors();

    _reset();
  }

  // 4. Initial buy of token to be traded
  // As long as there are funds of baseCurrency available you can invest in token
  function initialAssetBuy(address tokenOut, uint value) external onlyOwner {
    require(block.timestamp >= contributionEnd, "Contributtion period not yet passed");
    require(getTokenBalance(DAI) > 0, "No more token of baseCurrency available in this contract");
    require(value > 0, "Each registered asset must get a value of baseCurrency");
    require(tokenOut != DAI, "You can not trade baseCurrency into baseCurrency");

    // function trade
    uint amountOut = _tradeOnUniswapV3(DAI, tokenOut, WETH, value);
    uint price = (value / amountOut);

    assets[nextAssetId] = Asset(nextAssetId, getTokenSticker(tokenOut), tokenOut, price, 0);
    nextAssetId++;

    currentState = State.TRADING;
  }

  // 5. Sell token depending on predicted price development
  //
  function sellToken(uint _assetId, /*uint currentPrice,*/ uint predPrice, uint tuner) external onlyOwner {
    require(currentState == State.TRADING, "Tradingbot must be started first");
    require(getTokenBalance(assets[_assetId].tokenAddress) > 0, "No token available");

    // Check if price predicted in future x hours < (last buy - tuner)
    if (predPrice < (assets[_assetId].lastPrice.sub(tuner))) {
      uint value = getTokenBalance(assets[_assetId].tokenAddress);

      address tokenBridge;

      if (assets[_assetId].tokenAddress == WETH) {
        tokenBridge = UNI;
      } else {
        tokenBridge = WETH;
      }

      // Trade on uniswapV3
      uint amountOut = _tradeOnUniswapV3(assets[_assetId].tokenAddress, DAI, tokenBridge, value);
      uint price = amountOut.div(value);

      //Updates the availableFunds of the asset in DAI
      assets[_assetId].availableFunds = assets[_assetId].availableFunds.add(amountOut);

      assets[_assetId].lastPrice = price;
    }
  }

  //

  // 6. Buy token depending on predicted price development
  function buyToken(uint _assetId, /*uint currentPrice,*/ uint predPrice, uint tuner) external onlyOwner {
    require(currentState == State.TRADING, "Tradingbot must be started first");
    require(assets[_assetId].availableFunds > 0, "No funds available");

    // Check if price predicted in future x hours < (last buy - tuner)
    if (predPrice > (assets[_assetId].lastPrice.add(tuner))) {
      uint value = assets[_assetId].availableFunds;

      address tokenBridge;

      if (assets[_assetId].tokenAddress == WETH) {
        tokenBridge = UNI;
      } else {
        tokenBridge = WETH;
      }

      // Trade on uniswapV3
      uint amountOut = _tradeOnUniswapV3(DAI, assets[_assetId].tokenAddress, tokenBridge, value);
      uint price = value.div(amountOut);

      //Updates the availableFunds of the asset in DAI
      assets[_assetId].availableFunds = assets[_assetId].availableFunds.sub(value);

      assets[_assetId].lastPrice = price;
    }
  }

  //

  // 7. Liquidate portfolio and return money to investors
  function liquidatePortfolio() external payable onlyOwner nonReentrant {
    for (uint i; i < nextAssetId; i++) {
      if (getTokenBalance(assets[i].tokenAddress) > 0) {
        if (assets[i].tokenAddress != WETH) {
          uint amountIn = getTokenBalance(assets[i].tokenAddress);
          _tradeOnUniswapV3(assets[i].tokenAddress, WETH, DAI, amountIn);
        }

        IWETH9(WETH).approve(address(this), getTokenBalance(WETH));
        IWETH9(WETH).withdraw(getTokenBalance(WETH));

        //Updates the availableFunds of the asset in DAI
        assets[i].availableFunds = 0;

        //Calculates the selling price in DAI
        uint _price = 0;

        assets[i].lastPrice = _price;
      }
    }

    _refundInvestors();

    _reset();
  }

  // 8. Some view functions
  function getBalance() external view returns (uint) {
    return address(this).balance;
  }

  function getTokenBalance(address tokenAddress) public view returns (uint tokenBalance) {
    tokenBalance = IERC20(tokenAddress).balanceOf(address(this));
  }

  function getTokenSticker(address tokenAddress) public view returns (string memory _sticker) {
    _sticker = IERC20Metadata(tokenAddress).symbol();
  }

  function _uniswapV3PoolExists(
    address _tokenIn,
    address _tokenOut
  ) public view returns (bool pool_existence, uint24 _poolFee) {
    // UniswapV3 allows 3 different pool fees
    uint24 poolFee_1 = 500;
    uint24 poolFee_2 = 3000;
    uint24 poolFee_3 = 10000;

    if (SwapV3Factory.getPool(_tokenIn, _tokenOut, poolFee_1) != address(0)) {
      _poolFee = poolFee_1;
      pool_existence = true;
    } else if (SwapV3Factory.getPool(_tokenIn, _tokenOut, poolFee_2) != address(0)) {
      _poolFee = poolFee_2;
      pool_existence = true;
    } else if (SwapV3Factory.getPool(_tokenIn, _tokenOut, poolFee_3) != address(0)) {
      _poolFee = poolFee_3;
      pool_existence = true;
    }
  }

  //
  function _tradeOnUniswapV3(
    address _tokenIn,
    address _tokenOut,
    address _tokenBridge,
    uint _amountIn
  ) public returns (uint _amountOut) {
    PoolFee memory poolFees;
    bool _success;
    bool tradeSuccess;
    bytes memory returnData;

    (_success, poolFees.fee1) = _uniswapV3PoolExists(_tokenIn, _tokenOut);

    if (_success) {
      direction = 1;
      // Approve the SwapRouter contract for the amount of DAI
      // I first made an error to approve this contract - that's wrong, the DAI was already tranfered to this contract in contribute()
      IERC20(_tokenIn).approve(address(SwapRouter), _amountIn);

      ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
        tokenIn: _tokenIn,
        tokenOut: _tokenOut,
        fee: poolFees.fee1,
        recipient: address(this),
        deadline: block.timestamp.add(15),
        amountIn: _amountIn,
        amountOutMinimum: 1,
        sqrtPriceLimitX96: 0
      });

      (tradeSuccess, returnData) = address(SwapRouter).call( // This creates a low level call to the contract
        abi.encodePacked( // This encodes the function to call and the parameters to pass to that function
          SwapRouter.exactInputSingle.selector, // This is the function identifier of the function we want to call
          abi.encode(params) // This encodes the parameter we want to pass to the function
        )
      );

      if (tradeSuccess) {
        // SwapRouter.exactInputSingle completed successfully (did not revert)
        _amountOut = abi.decode(returnData, (uint256));

        return _amountOut;
      }
    }

    if (_success == false || tradeSuccess == false) {
      // SwapRouter.exactInputSingle. However, the complete tx did not revert and we can handle the case here.
      direction = 2;
      // TRY THE MULTIHOP TRADE
      (_success, poolFees.fee2) = _uniswapV3PoolExists(_tokenIn, _tokenBridge);
      require(_success, "Pool to bridge does not exist");
      _success = false;

      (_success, poolFees.fee3) = _uniswapV3PoolExists(_tokenBridge, _tokenOut);
      require(_success, "Pool from _tokenBridge to _tokenOut does not exist");
      _success = false;

      ISwapRouter.ExactInputParams memory params1 = ISwapRouter.ExactInputParams({
        path: abi.encodePacked(_tokenIn, poolFees.fee2, _tokenBridge, poolFees.fee3, _tokenOut),
        recipient: address(this),
        deadline: block.timestamp.add(15),
        amountIn: _amountIn,
        amountOutMinimum: 1
      });

      // Executes the swap.
      _amountOut = SwapRouter.exactInput(params1);

      return _amountOut;
    } else {
      revert("Could not trade asset");
    }
  }

  // swap DAI to WETH, then iterate over the nextInvestorId and refund the contract balance to the investors in relation to their shares
  function _refundInvestors() public payable {
    require(protect == false, "Protection activated");
    protect = true;

    if (getTokenBalance(DAI) > 0) {
      uint amountIn = getTokenBalance(DAI);
      uint amountOut = _tradeOnUniswapV3(DAI, WETH, UNI, amountIn);

      IWETH9(WETH).approve(address(this), amountOut);
      IWETH9(WETH).withdraw(amountOut);
    }

    // Save value of contract balance and Calculate share for each investor
    require(address(this).balance > 0, "No ether available to be redistributed");
    uint _totalFunds = address(this).balance;

    for (uint i = 0; i < nextInvestorId; i++) {
      uint _refund = (_totalFunds * shares[investors[i]]) / totalShares;
      payable(investors[i]).transfer(_refund);
    }

    protect = false;
  }

  function _reset() public {
    // mappings must be cleaned up one by one; delete key word only works for each entry
    for (uint i = 0; i < nextInvestorId; i++) {
      delete shares[investors[i]];
      delete investors[i];
    }

    for (uint j = 0; j < nextAssetId; j++) {
      delete assets[j];
    }

    nextInvestorId = 0;
    nextAssetId = 0;
    totalShares = 0;
    // Other currentState variables minAmount and contributionEnd must be reinitialized in function initialize()

    currentState = State.IDLE;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  modifier timeOut() {
    require(block.timestamp < contributionEnd, "Time over");
    _;
  }
}
