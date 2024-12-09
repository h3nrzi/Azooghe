import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Spinner from "../../components/Spinner";
import { useGetProductsQuery } from "../../services/ApiProduct";

// Data for product sales
const productSalesData = [
  { name: "محصول 1", sales: 400 },
  { name: "محصول 2", sales: 300 },
  { name: "محصول 3", sales: 300 },
  { name: "محصول 4", sales: 200 },
  { name: "محصول 5", sales: 100 },
];

// Data for daily product sales
const dailyProductSales = [
  { date: "1402/07/01", sales: 120 },
  { date: "1402/07/02", sales: 150 },
  { date: "1402/07/03", sales: 100 },
  { date: "1402/07/04", sales: 200 },
  { date: "1402/07/05", sales: 180 },
  { date: "1402/07/06", sales: 220 },
  { date: "1402/07/07", sales: 160 },
];

// Data for daily user registrations
const dailyUserRegistrations = [
  { date: "1402/07/01", registrations: 30 },
  { date: "1402/07/02", registrations: 45 },
  { date: "1402/07/03", registrations: 20 },
  { date: "1402/07/04", registrations: 50 },
  { date: "1402/07/05", registrations: 35 },
  { date: "1402/07/06", registrations: 60 },
  { date: "1402/07/07", registrations: 40 },
];

// Chart colors
const chartColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EEB", "#FF5678", "#FF5678"];

function Dashboard() {
  const { data: products, isLoading } = useGetProductsQuery({});
  const productsList = products?.data?.products.slice(0);

  const sortedProductsByRating = productsList?.sort((a, b) => b.rating - a.rating);
  console.log(sortedProductsByRating);

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">داشبورد</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <h2 className="text-lg md:text-xl font-semibold mt-6 text-center">محصولات با بیشترین فروش</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={productSalesData} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius="80%">
                {productSalesData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                itemStyle={{
                  color: "#333",
                  fontSize: "14px",
                }}
                labelStyle={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-1">
          <h2 className="text-lg md:text-xl font-bold mt-6 text-center text-blue-600">
            محصولات با بالاترین رضایت مشتریان
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={sortedProductsByRating?.slice(0, 5)}
                dataKey="rating"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
              >
                {sortedProductsByRating?.slice(0, 5).map((_, index) => {
                  return <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />;
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                itemStyle={{
                  color: "#333",
                  fontSize: "14px",
                }}
                labelStyle={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  marginTop: "10px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily product sales line chart */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-lg md:text-xl font-semibold my-8">تعداد محصولات فروخته شده در هر روز</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyProductSales}>
              <XAxis dataKey="date" tick={{ dx: 20, dy: 10 }} />
              <YAxis tick={{ dx: -20, dy: -20 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#FF7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily user registrations line chart */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-lg md:text-xl font-semibold my-8">تعداد کاربران ثبت نام کرده در هر روز</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyUserRegistrations}>
              <XAxis dataKey="date" tick={{ dx: 20, dy: 10 }} />
              <YAxis tick={{ dx: -20, dy: -20 }} />
              <Tooltip />
              <Line type="monotone" dataKey="registrations" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
