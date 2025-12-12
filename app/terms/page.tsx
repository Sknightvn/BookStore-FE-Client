"use client"

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Điều khoản sử dụng</h1>

      <p className="text-gray-700 mb-4">
        Khi truy cập và mua sắm tại KT.BookStore, bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây. Vui lòng đọc kỹ
        trước khi sử dụng dịch vụ của chúng tôi.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Chấp nhận điều khoản</h2>
      <p className="text-gray-700">
        Bằng việc truy cập website, tạo tài khoản hoặc đặt hàng, bạn xác nhận đã đọc, hiểu và đồng ý với các điều khoản
        này. Nếu không đồng ý, vui lòng ngừng sử dụng website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Tài khoản và bảo mật</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.</li>
        <li>Vui lòng thông báo ngay cho KT.BookStore khi phát hiện truy cập trái phép hoặc nghi ngờ bị lộ thông tin.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Đặt hàng và thanh toán</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Đơn hàng chỉ được xem là thành công khi bạn hoàn tất bước xác nhận và hệ thống ghi nhận thành công.</li>
        <li>KT.BookStore có quyền từ chối hoặc hủy đơn trong trường hợp: thông tin không chính xác, nghi ngờ gian lận,
          hết hàng hoặc lỗi hiển thị giá do hệ thống.</li>
        <li>Trong trường hợp hủy đơn đã thanh toán, chúng tôi sẽ hoàn tiền theo quy trình thông báo đến bạn.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Giá bán và khuyến mãi</h2>
      <p className="text-gray-700">
        Giá bán hiển thị trên website là giá đã bao gồm thuế (nếu có) nhưng <strong>chưa bao gồm phí vận chuyển</strong>.
        Các chương trình khuyến mãi có thể áp dụng trong thời gian nhất định và có thể kết thúc mà không cần thông báo
        trước.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Quyền sở hữu trí tuệ</h2>
      <p className="text-gray-700">
        Toàn bộ nội dung trên website (hình ảnh, nội dung mô tả, bài viết, bố cục…) thuộc quyền sở hữu hoặc quyền sử
        dụng hợp pháp của KT.BookStore. Nghiêm cấm sao chép, sử dụng cho mục đích thương mại mà không có sự đồng ý bằng
        văn bản.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Giới hạn trách nhiệm</h2>
      <p className="text-gray-700">
        KT.BookStore nỗ lực cung cấp thông tin chính xác và dịch vụ ổn định, tuy nhiên không chịu trách nhiệm cho các
        thiệt hại gián tiếp phát sinh từ việc sử dụng website, lỗi đường truyền, gián đoạn hệ thống hoặc các sự kiện
        bất khả kháng khác.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Thay đổi điều khoản</h2>
      <p className="text-gray-700">
        Chúng tôi có thể cập nhật điều khoản sử dụng bất cứ lúc nào. Phiên bản mới sẽ được công bố trên website và có
        hiệu lực kể từ thời điểm đăng tải. Việc bạn tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa
        với việc bạn chấp nhận các thay đổi đó.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Luật áp dụng</h2>
      <p className="text-gray-700">
        Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp (nếu có) sẽ được ưu tiên giải quyết bằng
        thương lượng; nếu không đạt được thỏa thuận, sẽ được đưa ra cơ quan có thẩm quyền tại Việt Nam.
      </p>

      <p className="text-gray-500 text-sm mt-6">
        Nội dung trên mang tính mẫu tham khảo. Nếu bạn cần tuân thủ chặt chẽ các quy định pháp lý, nên tham khảo thêm ý
        kiến tư vấn pháp lý chuyên nghiệp.
      </p>
    </div>
  )
}
