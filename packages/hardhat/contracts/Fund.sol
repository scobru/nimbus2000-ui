pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IOracle {
  function getStatus() external view returns (uint8);
}

contract Fund is ERC20Snapshot, Ownable {
  using SafeERC20 for IERC20;

  address public operator;
  uint256 public protocolFee = 0.1 ether;
  uint256 public devPercentage = 100;
  uint24 public poolFee = 3000;

  IUniswapV3Pool public immutable pool;
  ISwapRouter public immutable swapRouter;
  IOracle public immutable oracle;
  IERC20 public immutable usdc; // 6 decimals
  IERC20 public immutable wbtc; // 8 decimals

  event Deposit(address indexed user, uint256 amount);
  event Withdraw(address indexed user, uint256 amount);
  event SwapExecuted(address indexed caller, uint256 amountIn, uint256 amountOut, bool fromUSDCtoWBTC);

  constructor(
    address _pool,
    address _swapRouter,
    address _oracle,
    address _usdc,
    address _wbtc,
    address _operator
  ) ERC20("Nimbus 2000", "NIM2000") {
    pool = IUniswapV3Pool(_pool);
    swapRouter = ISwapRouter(_swapRouter);
    oracle = IOracle(_oracle);
    usdc = IERC20(_usdc);
    wbtc = IERC20(_wbtc);
    operator = _operator;
  }

  function changeProtocolFee(uint256 _protocolFee) external onlyOwner {
    protocolFee = _protocolFee;
  }

  function getStatus() external view returns (uint8) {
    return oracle.getStatus();
  }

  function changeOperator(address _operator) external onlyOwner {
    operator = _operator;
  }

  function deposit(uint256 amount) external payable {
    // get real usdc value with 6 decimals
    uint256 amount12e = (amount / 1e12);
    usdc.safeTransferFrom(msg.sender, address(this), amount12e);
    require(msg.value == protocolFee, "Protocol fee is not correct");

    uint256 amountToSend = (msg.value * devPercentage) / 10000;
    payable(owner()).transfer(amountToSend);
    payable(operator).transfer(msg.value - amountToSend);

    if (oracle.getStatus() == 1) {
      usdc.approve(address(swapRouter), amount12e);

      ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
        tokenIn: address(usdc),
        tokenOut: address(wbtc),
        fee: poolFee,
        recipient: address(this),
        deadline: block.timestamp,
        amountIn: amount12e,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });

      // The call to `exactInputSingle` executes the swap.
      uint256 amountOut = swapRouter.exactInputSingle(params);

      emit SwapExecuted(msg.sender, amount12e, amountOut, true);
    }

    _mint(msg.sender, amount);
    emit Deposit(msg.sender, amount);
  }

  function withdraw(uint256 shares) external {
    uint8 status = oracle.getStatus();

    if (status == 1) {
      uint256 amountOut = (shares * wbtc.balanceOf(address(this))) / totalSupply();
      _burn(msg.sender, shares);
      wbtc.safeTransfer(msg.sender, amountOut);
      emit Withdraw(msg.sender, amountOut);
    } else if (status == 0) {
      uint256 amountOut = (shares * usdc.balanceOf(address(this))) / totalSupply();
      _burn(msg.sender, shares);
      usdc.safeTransfer(msg.sender, amountOut);
      emit Withdraw(msg.sender, amountOut);
    }
  }

  function executeSwap(bool fromUSDCtoWBTC) external {
    require(msg.sender == operator || msg.sender == owner(), "Caller is not the operator or owner");

    if (fromUSDCtoWBTC) {
      uint256 amount = usdc.balanceOf(address(this));
      usdc.approve(address(swapRouter), amount);

      ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
        tokenIn: address(usdc),
        tokenOut: address(wbtc),
        fee: poolFee,
        recipient: address(this),
        deadline: block.timestamp,
        amountIn: amount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });

      // The call to `exactInputSingle` executes the swap.
      uint256 amountOut = swapRouter.exactInputSingle(params);

      emit SwapExecuted(msg.sender, amount, amountOut, true);
    } else {
      uint256 amount = wbtc.balanceOf(address(this));
      wbtc.approve(address(swapRouter), amount);

      ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
        tokenIn: address(wbtc),
        tokenOut: address(usdc),
        fee: poolFee,
        recipient: address(this),
        deadline: block.timestamp,
        amountIn: amount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });

      // The call to `exactInputSingle` executes the swap.
      uint256 amountOut = swapRouter.exactInputSingle(params);

      emit SwapExecuted(msg.sender, amount, amountOut, false);
    }
  }
}
