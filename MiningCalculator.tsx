
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MiningCalculator() {
  const [hashrate, setHashrate] = useState(110); // TH/s
  const [power, setPower] = useState(3250); // Watts
  const [extraPower, setExtraPower] = useState(5000); // Watts (other devices)
  const [electricity, setElectricity] = useState(0.32); // RMB/kWh
  const [btcPrice, setBtcPrice] = useState(450000); // RMB
  const [networkHashrate, setNetworkHashrate] = useState(600000000); // TH/s
  const [miners, setMiners] = useState(100);
  const [feeRate, setFeeRate] = useState(2); // %
  const [annualHours, setAnnualHours] = useState(8760); // Hours of mining per year
  const [infrastructureCost, setInfrastructureCost] = useState(1000000); // Total fixed infrastructure cost (RMB)
  const [investmentCost, setInvestmentCost] = useState(0); // Optional total investment (equipment + infra)
  const [years, setYears] = useState(3); // Multi-year projection

  const dailyBTC = (hashrate / networkHashrate) * 144 * 3.125;
  const hourlyBTC = dailyBTC / 24;
  const hourlyRevenuePerMiner = hourlyBTC * btcPrice * (1 - feeRate / 100);
  const hourlyPowerCost = (power / 1000) * electricity;
  const hourlyExtraPowerCost = (extraPower / 1000) * electricity;
  const netProfitPerMinerPerHour = hourlyRevenuePerMiner - hourlyPowerCost;
  const totalNetProfitPerHour = netProfitPerMinerPerHour * miners - hourlyExtraPowerCost;
  const annualProfit = totalNetProfitPerHour * annualHours - infrastructureCost;
  const multiYearProfit = annualProfit * years;
  const paybackPeriod = investmentCost > 0 && totalNetProfitPerHour > 0 ? (investmentCost / (totalNetProfitPerHour * annualHours)).toFixed(1) : "N/A";

  const chartData = Array.from({ length: years }, (_, i) => ({
    year: `第${i + 1}年`,
    profit: +(annualProfit * (i + 1)).toFixed(2)
  }));

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div>
            <Label>矿机算力 (TH/s)</Label>
            <Input type="number" value={hashrate} onChange={e => setHashrate(+e.target.value)} />
          </div>
          <div>
            <Label>矿机功耗 (W)</Label>
            <Input type="number" value={power} onChange={e => setPower(+e.target.value)} />
          </div>
          <div>
            <Label>其他设备总功耗 (W)</Label>
            <Input type="number" value={extraPower} onChange={e => setExtraPower(+e.target.value)} />
          </div>
          <div>
            <Label>电价 (元/kWh)</Label>
            <Input type="number" step="0.01" value={electricity} onChange={e => setElectricity(+e.target.value)} />
          </div>
          <div>
            <Label>比特币价格 (元)</Label>
            <Input type="number" value={btcPrice} onChange={e => setBtcPrice(+e.target.value)} />
          </div>
          <div>
            <Label>全网算力 (TH/s)</Label>
            <Input type="number" value={networkHashrate} onChange={e => setNetworkHashrate(+e.target.value)} />
          </div>
          <div>
            <Label>矿机数量</Label>
            <Input type="number" value={miners} onChange={e => setMiners(+e.target.value)} />
          </div>
          <div>
            <Label>矿池手续费 (%)</Label>
            <Input type="number" step="0.1" value={feeRate} onChange={e => setFeeRate(+e.target.value)} />
          </div>
          <div>
            <Label>全年挖矿时间 (小时)</Label>
            <Input type="number" value={annualHours} onChange={e => setAnnualHours(+e.target.value)} />
          </div>
          <div>
            <Label>矿场建设及固定成本 (元)</Label>
            <Input type="number" value={infrastructureCost} onChange={e => setInfrastructureCost(+e.target.value)} />
          </div>
          <div>
            <Label>总投资成本（元）</Label>
            <Input type="number" value={investmentCost} onChange={e => setInvestmentCost(+e.target.value)} />
          </div>
          <div>
            <Label>预测年限</Label>
            <Input type="number" value={years} onChange={e => setYears(+e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">挖矿收益估算</h2>
          <p>每小时单台产出：{hourlyBTC.toFixed(8)} BTC</p>
          <p>每小时单台收益：¥{hourlyRevenuePerMiner.toFixed(2)}</p>
          <p>每小时单台电费：¥{hourlyPowerCost.toFixed(2)}</p>
          <p>每小时单台净利润：¥{netProfitPerMinerPerHour.toFixed(2)}</p>
          <hr />
          <p>每小时其他设备电费：¥{hourlyExtraPowerCost.toFixed(2)}</p>
          <p>总每小时净利润（含其他设备）：¥{totalNetProfitPerHour.toFixed(2)}</p>
          <p>预计年净利润（扣除矿场成本）：¥{annualProfit.toFixed(2)}（基于 {annualHours} 小时）</p>
          <p>{years} 年累计净利润：¥{multiYearProfit.toFixed(2)}</p>
          <p>预计回本周期：{paybackPeriod} 年</p>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(v: number) => `¥${v.toLocaleString()}`} />
                <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
