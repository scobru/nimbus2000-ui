import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CryptoChart = (datachart: any) => {
  const lineColors: any = {
    adj_data_autoselect: "#82ca9d",
    predicted_autoselect: "#86dv9d",
    adj_data_linregr: "#72ca9d",
    predicted_linregr: "#72ee9d",
    adj_data_tcn: "#45ca9d",
    predicted_tcn: "#94be9d",
    adj_data_rnn: "#78da9f",
    predicted_rnn: "#94be9d",
    adj_data_nbeats: "#78da9f",
    predicted_nbeats: "#94be9d",
    adj_data_theta: "#78da9f",
    predicted_theta: "#94be9d",
    adj_data_trans: "#78da9f",
    predicted_trans: "#94be9d",
    adj_data_autoselect_ema: "#78da9f",
    predicted_autoselect_ema: "#94be9d",
    adj_data_brnn0: "#78da9f",
    predicted_brnn0: "#94be9d",
    adj_data_brnn1: "#78da9f",
    predicted_brnn1: "#94be9d",
    adj_data_brnn2: "#78da9f",
    predicted_brnn2: "#94be9d",
    adj_data_nhits: "#78da9f",
    predicted_nhits: "#94be9d",
    predicted_anom0: "#94be9d",
    predicted_anom1: "#94be9d",
    predicted_anom2: "#94be9d",
    adj_data_regr: "#78da9f",
    predicted_regr: "#94be9d",
  };

  return (
    <>
      <ResponsiveContainer width="100%" height={500} className={"rounded-lg mx-auto "}>
        <LineChart
          data={datachart.datachart}
          margin={{
            top: 5,
            right: 5,
            left: 2,
            bottom: 5,
          }}
          accessibilityLayer={true}
          className="py-auto"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" domain={["auto", "auto"]} />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ backgroundColor: "black", fontStyle: "white" }}
            itemSorter={(item: any) => -item.value}
          />
          {/*           
          <Legend />
           */}{" "}
          {Object.keys(lineColors).map(key => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={String(lineColors[key])}
              strokeWidth={2}
              dot={false}
              accentHeight={2}
              activeDot={{ r: 8 }}
              hide={key === "Date"}
            />
          ))}
          <Line type="monotone" dataKey="Close" stroke="yellow" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

    </>

  );
};

export default CryptoChart;
