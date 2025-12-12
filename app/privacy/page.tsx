"use client"

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Chính sách bảo mật</h1>

      <p className="text-gray-700 mb-4">
        KT.BookStore tôn trọng và cam kết bảo vệ quyền riêng tư của khách hàng. Chính sách này giải thích cách chúng tôi
        thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Thông tin được thu thập</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng.</li>
        <li>Thông tin tài khoản (nếu bạn đăng ký), lịch sử đơn hàng.</li>
        <li>Thông tin kỹ thuật: địa chỉ IP, loại trình duyệt, cookie phục vụ phân tích và cải thiện dịch vụ.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Mục đích sử dụng thông tin</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Xử lý đơn hàng, giao hàng và chăm sóc khách hàng.</li>
        <li>Gửi thông báo về tình trạng đơn, chương trình khuyến mãi (khi bạn đồng ý).</li>
        <li>Cải thiện chất lượng sản phẩm, dịch vụ và trải nghiệm trên website.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Chia sẻ thông tin với bên thứ ba</h2>
      <p className="text-gray-700">
        Chúng tôi có thể chia sẻ thông tin cần thiết với đối tác vận chuyển, đối tác thanh toán để hoàn tất đơn hàng.
        KT.BookStore <strong>không bán hoặc cho thuê</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục
        đích thương mại riêng của họ.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Lưu trữ và bảo mật</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Thông tin được lưu trữ trên hệ thống có các biện pháp bảo mật phù hợp.</li>
        <li>Chúng tôi không lưu trữ thông tin mật khẩu thanh toán hoặc số thẻ ngân hàng của bạn.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Quyền của khách hàng</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Yêu cầu xem, cập nhật, chỉnh sửa thông tin cá nhân.</li>
        <li>Yêu cầu xóa thông tin tài khoản (trong phạm vi pháp luật cho phép).</li>
        <li>Hủy đăng ký nhận email marketing bất cứ lúc nào.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookie và công cụ theo dõi</h2>
      <p className="text-gray-700">
        Website có thể sử dụng cookie để ghi nhớ tùy chọn của bạn và phân tích hành vi truy cập. Bạn có thể tắt cookie
        trong trình duyệt, tuy nhiên một số tính năng có thể hoạt động không tối ưu.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Liên hệ</h2>
      <p className="text-gray-700">
        Nếu có câu hỏi liên quan đến chính sách bảo mật, vui lòng liên hệ: <strong>ltranbaokhanh@gmail.com</strong> hoặc{" "}
        <strong>(094) 6280 159</strong>.
      </p>

      <p className="text-gray-500 text-sm mt-6">
        Lưu ý: Nội dung trên mang tính tham khảo và có thể được điều chỉnh để phù hợp hơn với yêu cầu pháp lý thực tế.
      </p>
    </div>
  )
}
