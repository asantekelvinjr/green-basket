import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyPayment = () => {
  const { navigate, axios } = useAppContext();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const router = useNavigate();
  //    const [reference, setReference] = useState('');

  useEffect(() => {
    if (!reference) return;

    (async function () {
      try {
        const { data } = await axios.post(`/api/order/verify-payment`, {
          reference,
        });
        console.log(data);

        // const { order_id } = data;
        // re-route to single orderpage
        // router(`/my-orders/${order_id}`);
        router(`/my-orders`);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [reference, axios, router]);

  console.log("Verifying payment for reference:", reference);

  return (
    <div className="mt-24 max-w-lg mx-auto px-4">
      <h2 className="text-2xl font-semibold text-center">
        Verify Your Payment
      </h2>

      <form className="mt-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter transaction reference"
          className="border border-gray-300 rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull text-white py-2 rounded hover:bg-primary-dark transition"
        >
          Verify Payment
        </button>
      </form>

      <div className="mt-3 flex items-center justify-center text-[18px] ">
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center align-center gap-2 text-primary hover:text-primary-dull font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Go to Orders
        </button>
      </div>
    </div>
  );
};

export default VerifyPayment;
