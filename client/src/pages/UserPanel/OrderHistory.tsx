import { useState } from "react";
import Pagination from "../../components/Pagination";
import Spinner from "../../components/Spinner";
import DataTable from "../../components/DataTable";
import { useGetMyOrdersQuery } from "../../services/OrderApi";
import { Order } from "../../types/OrderType";
import { Link } from "react-router-dom";

export type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
};

function OrderHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order | ""; direction: "asc" | "desc" | null }>({
    key: "",
    direction: null,
  });
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "delivered" | "undelivered">("all");

  const sortParam =
    sortConfig.key && sortConfig.direction ? `${sortConfig.direction === "asc" ? "" : "-"}${sortConfig.key}` : "";

  const { data: orderData, isLoading: isLoadingOrders } = useGetMyOrdersQuery({
    sort: sortParam,
    isPaid: filter === "paid" ? true : filter === "unpaid" ? false : undefined,
    isDelivered: filter === "delivered" ? true : filter === "undelivered" ? false : undefined,
  });

  if (isLoadingOrders) return <Spinner />;

  const orders = orderData?.data?.orders || [];
  const itemsPerPage = 5;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: keyof Order) => {
    if (key === "isPaid" || key === "isDelivered") return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const columns: Column<Order>[] = [
    { key: "_id", label: "شناسه سفارش", sortable: true },
    { key: "user", label: "کاربر", sortable: true },
    {
      key: "createdAt",
      label: "تاریخ ایجاد",
      sortable: true,
      render: (order: Order) => new Date(order.createdAt).toLocaleDateString(),
    },
    {
      key: "isPaid",
      label: "وضعیت پرداخت",
      render: (order: Order) => (
        <span className={`font-semibold ${order.isPaid ? "text-green-600" : "text-red-600"}`}>
          {order.isPaid ? "پرداخت شده" : "پرداخت نشده"}
        </span>
      ),
    },
    {
      key: "isDelivered",
      label: "وضعیت تحویل",
      render: (order: Order) => (
        <span className={`font-semibold ${order.isDelivered ? "text-blue-600" : "text-yellow-600"}`}>
          {order.isDelivered ? "تحویل داده شده" : "تحویل نشده"}
        </span>
      ),
    },
    { key: "totalPrice", label: "مجموع قیمت", sortable: true },
    {
      key: "_id",
      label: "جزئیات",
      render: (order: Order) => (
        <Link
          to={`/user/manage-order/${order._id}`}
          className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition"
        >
          نمایش
        </Link>
      ),
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">تاریخچه سفارشات</h1>
      <div className="border-b border-gray-200 mb-4">
        <ul className="flex overflow-auto">
          {[
            { key: "all", label: "همه" },
            { key: "delivered", label: "تحویل شده" },
            { key: "undelivered", label: "تحویل نشده" },
            { key: "paid", label: "پرداخت شده" },
            { key: "unpaid", label: "پرداخت نشده" },
          ].map(({ key, label }) => (
            <li
              key={key}
              className={`relative px-4 py-2 flex-grow text-center cursor-pointer ${
                filter === key ? "text-primary-500" : "text-gray-500"
              }`}
              onClick={() => setFilter(key as typeof filter)}
            >
              {label}
              {filter === key && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500"></div>}
            </li>
          ))}
        </ul>
      </div>

      <DataTable data={currentOrders} columns={columns} onSort={handleSort} sortConfig={sortConfig} />
      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

export default OrderHistory;
