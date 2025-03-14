import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
interface Props{
  day?: string,
  thisWeek?: number,
  pastWeek?: number, 
}
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function Graph({ data }: { data?: Props[] |any}) {  
  const chartConfig = {
    thisWeek: {
      label: "This Week",
      color: "#2980b9",
    },
    pastWeek: {
      label: "Past Week",
      color: "#5daed2",
    },
  } satisfies ChartConfig;
  return (
    <Card className="mt-4 w-[90%] place-self-end" style={{ background: "transparent", borderColor: "transparent" }}>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255, 0.1)" />
            
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            
            <YAxis domain={[0, 'auto']} />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            
            <defs>
              <linearGradient id="fillThisWeek" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.thisWeek.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.thisWeek.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPastWeek" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.pastWeek.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.pastWeek.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <Area
              dataKey="thisWeek"
              type="natural"
              fill="url(#fillThisWeek)"
              fillOpacity={0.4}
              stroke={chartConfig.thisWeek.color}
            />
            <Area
              dataKey="pastWeek"
              type="natural"
              fill="url(#fillPastWeek)"
              fillOpacity={0.4}
              stroke={chartConfig.pastWeek.color}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
