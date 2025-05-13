import { DiaPrevisao } from "../types/weather";

export default function ForecastCard({ dia, tempo, maxima, minima }: DiaPrevisao) {
  return (
    <tr className="border-b">
      <td className="px-4 py-2">{dia}</td>
      <td className="px-4 py-2">{tempo}</td>
      <td className="px-4 py-2">{maxima}°C</td>
      <td className="px-4 py-2">{minima}°C</td>
    </tr>
  );
}
