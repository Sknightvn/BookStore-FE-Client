"use client"

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Chính sách đổi trả</h1>

      <p className="text-gray-700 mb-4">
        KT.BookStore luôn mong muốn mang đến trải nghiệm mua sắm hài lòng cho khách hàng. Nếu sản phẩm gặp vấn đề,
        bạn hoàn toàn có thể yêu cầu đổi/trả theo các điều kiện dưới đây.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Thời hạn đổi trả</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng đối với lỗi từ nhà sản xuất hoặc do KT.BookStore.</li>
        <li>Trong vòng <strong>3 ngày</strong> kể từ ngày nhận hàng đối với trường hợp giao nhầm sản phẩm.</li>
        <li>Thời gian được tính theo thời điểm ghi nhận trên hệ thống của đơn vị vận chuyển.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Trường hợp được đổi/trả</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Sách bị rách, bung gáy, in lỗi, thiếu/trùng trang do nhà in.</li>
        <li>Sản phẩm bị hư hỏng do quá trình vận chuyển (ướt, móp méo nặng…).</li>
        <li>Giao nhầm tựa sách, sai số lượng, sai phiên bản so với đơn đặt hàng.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Điều kiện sản phẩm khi đổi/trả</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Sản phẩm còn nguyên vẹn, không bị viết vẽ, tẩy xóa, bôi bẩn do lỗi từ phía khách hàng.</li>
        <li>Còn đầy đủ hóa đơn mua hàng hoặc thông tin đặt hàng trên hệ thống.</li>
        <li>Đi kèm đầy đủ quà tặng, phụ kiện (nếu có).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Trường hợp không hỗ trợ đổi/trả</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Sản phẩm đã qua sử dụng với dấu hiệu hư hỏng do bảo quản không đúng cách.</li>
        <li>Sách giảm giá thanh lý, sách đồng giá được thông báo <strong>không hỗ trợ đổi/trả</strong> trước đó.</li>
        <li>Khách hàng tự ý làm mất, hư hỏng quà tặng hoặc phụ kiện kèm theo.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Quy trình đổi/trả</h2>
      <ol className="list-decimal list-inside text-gray-700 space-y-1">
        <li>Liên hệ với KT.BookStore qua số điện thoại hoặc email hỗ trợ, cung cấp mã đơn hàng và hình ảnh sản phẩm lỗi.</li>
        <li>Nhân viên CSKH xác nhận thông tin và hướng dẫn gửi lại sản phẩm (nếu cần).</li>
        <li>Sau khi nhận và kiểm tra, KT.BookStore sẽ tiến hành:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>Gửi lại sản phẩm mới cùng loại, hoặc</li>
            <li>Hoàn tiền qua phương thức thanh toán đã sử dụng (trong trường hợp hết hàng).</li>
          </ul>
        </li>
      </ol>

      <p className="text-gray-700 mt-6">
        Mọi thắc mắc về chính sách đổi trả, vui lòng liên hệ: <strong>ltranbaokhanh@gmail.com</strong> hoặc{" "}
        <strong>(094) 6280 159</strong>.
      </p>
    </div>
  )
}
