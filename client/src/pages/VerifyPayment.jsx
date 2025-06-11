import React from 'react'

const VerifyPayment = () => {
  return (
    <div className="mt-24 max-w-lg mx-auto px-4">
      <h2 className="text-2xl font-semibold text-center">Verify Your Payment</h2>
      
      <form className="mt-6 flex flex-col gap-4" >
           <input
            type="text"
            placeholder="Enter transaction reference"
            className="border border-gray-300 rounded px-3 py-2"/>

              <button
          type="submit"
          className="bg-primary hover:bg-primary-dull text-white py-2 rounded hover:bg-primary-dark transition"
        >
          Verify Payment
        </button>


      </form>
    </div>
  )
}

export default VerifyPayment

{/* <div className="mt-24 max-w-lg mx-auto px-4">
      <h2 className="text-2xl font-semibold text-center">Verify Your Payment</h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
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

      {status && <p className="mt-4 text-center">{status}</p>}
    </div> */}
