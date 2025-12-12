"use client"

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Chính sách vận chuyển</h1>

      <p className="text-gray-700 mb-4">
        KT.BookStore giao hàng toàn quốc thông qua các đơn vị vận chuyển uy tín, đảm bảo sách đến tay bạn nhanh chóng
        và an toàn.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Phạm vi giao hàng</h2>
      <p className="text-gray-700">
        Chúng tôi hỗ trợ giao hàng đến hầu hết các tỉnh/thành phố trên toàn lãnh thổ Việt Nam. Một số khu vực xa, hải
        đảo có thể phát sinh thời gian giao hàng lâu hơn hoặc phụ phí theo quy định của đơn vị vận chuyển.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Thời gian giao hàng dự kiến</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li><strong>Nội thành TP.HCM:</strong> 1–2 ngày làm việc.</li>
        <li><strong>Các tỉnh/thành lân cận:</strong> 2–4 ngày làm việc.</li>
        <li><strong>Các tỉnh/thành xa, khu vực miền núi, hải đảo:</strong> 4–7 ngày làm việc.</li>
      </ul>
      <p className="text-gray-700 mt-2 text-sm">
        Thời gian trên không bao gồm ngày lễ, Tết, thiên tai, hoặc các tình huống bất khả kháng khác.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Phí vận chuyển</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Phí ship được hiển thị rõ tại bước thanh toán tùy theo địa chỉ nhận hàng.</li>
        <li>Các chương trình <strong>miễn phí vận chuyển</strong> (nếu có) sẽ được công bố trên website hoặc khi thanh toán.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Giao hàng và kiểm tra</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Vui lòng giữ liên lạc qua số điện thoại đặt hàng để đơn vị vận chuyển có thể giao hàng thuận lợi.</li>
        <li>Bạn nên kiểm tra sơ bộ tình trạng kiện hàng trước khi nhận: vỏ hộp, băng keo, tem niêm phong…</li>
        <li>Nếu phát hiện kiện hàng bị rách, móp nặng hoặc có dấu hiệu bị mở trước, bạn có thể từ chối nhận và liên hệ ngay với KT.BookStore.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Giao hàng lại</h2>
      <p className="text-gray-700">
        Trong trường hợp đơn vị vận chuyển giao hàng nhiều lần nhưng không liên lạc được với khách, đơn hàng có thể
        bị hoàn về kho. KT.BookStore sẽ liên hệ lại để xác nhận giao lại (có thể phát sinh thêm phí vận chuyển).
      </p>
    </div>
  )
}
