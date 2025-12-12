"use client"

const faqs = [
  {
    question: "Làm sao để đặt hàng trên KT.BookStore?",
    answer:
      "Bạn chọn sản phẩm cần mua, bấm “Thêm vào giỏ”, sau đó vào giỏ hàng để kiểm tra và bấm “Thanh toán”. Điền đầy đủ thông tin nhận hàng, chọn phương thức thanh toán và xác nhận đơn.",
  },
  {
    question: "Tôi có thể thay đổi hoặc hủy đơn sau khi đặt không?",
    answer:
      "Bạn hãy liên hệ sớm nhất qua hotline hoặc email, cung cấp mã đơn hàng. Nếu đơn chưa được chuyển cho đơn vị vận chuyển, KT.BookStore sẽ hỗ trợ chỉnh sửa hoặc hủy.",
  },
  {
    question: "Bao lâu tôi nhận được sách?",
    answer:
      "Thông thường 1–2 ngày làm việc tại nội thành TP.HCM và 2–7 ngày cho các khu vực khác, tùy địa chỉ nhận hàng và tình trạng vận chuyển.",
  },
  {
    question: "Phí vận chuyển được tính như thế nào?",
    answer:
      "Phí ship được hệ thống tính tự động dựa trên địa chỉ nhận hàng và hiển thị rõ ở bước thanh toán. Một số chương trình khuyến mãi có thể miễn hoặc giảm phí ship.",
  },
  {
    question: "Làm sao nếu tôi nhận sách bị lỗi hoặc giao nhầm?",
    answer:
      "Bạn chụp hình sản phẩm và kiện hàng, gửi kèm mã đơn cho chúng tôi qua email hoặc fanpage. KT.BookStore sẽ kiểm tra và tiến hành đổi mới hoặc hoàn tiền theo chính sách đổi trả.",
  },
  {
    question: "KT.BookStore có xuất hóa đơn không?",
    answer:
      "Chúng tôi có hỗ trợ xuất hóa đơn GTGT cho đơn hàng doanh nghiệp. Vui lòng cung cấp thông tin xuất hóa đơn ngay khi đặt hàng hoặc liên hệ CSKH để được hỗ trợ.",
  },
  {
    question: "Tôi có cần tạo tài khoản mới mua được không?",
    answer:
      "Bạn cần tạo tài khoản để có thể giúp bạn xem lại lịch sử đơn hàng và nhận nhiều ưu đãi hơn.",
  },
  {
    question: "Thông tin thanh toán của tôi có được bảo mật không?",
    answer:
      "Có. Thông tin thanh toán được xử lý qua cổng thanh toán an toàn. KT.BookStore không lưu trữ số thẻ hoặc mật khẩu thanh toán của bạn trên hệ thống.",
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Câu hỏi thường gặp</h1>
      <p className="text-gray-700 mb-6">
        Nếu bạn không tìm thấy giải đáp phù hợp, hãy liên hệ trực tiếp với KT.BookStore để được hỗ trợ nhanh nhất.
      </p>

      <div className="space-y-4">
        {faqs.map((item) => (
          <div key={item.question} className="border border-gray-200 rounded-lg p-4 bg-white">
            <h2 className="font-semibold text-lg mb-1">{item.question}</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
