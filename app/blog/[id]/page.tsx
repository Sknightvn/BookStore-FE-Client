"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, BookOpen } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: string
  tags: string[]
  readTime: number
  image: string
}

// Mock blog post data - in real app this would come from API/database
const getBlogPost = (id: string): BlogPost | null => {
  const posts: BlogPost[] = [
    {
      id: "1",
      title: "10 Cuốn Sách Kinh Doanh Hay Nhất Năm 2024",
      excerpt:
        "Khám phá những cuốn sách kinh doanh được đánh giá cao nhất trong năm, từ chiến lược đến lãnh đạo.",
      content: `
        <p>Trong thế giới kinh doanh đầy biến động của năm 2024, việc cập nhật kiến thức và kỹ năng thông qua việc đọc sách là điều vô cùng quan trọng. Dưới đây là 10 cuốn sách kinh doanh được nhiều doanh nhân, nhà quản lý và bạn đọc quan tâm.</p>

        <h2>1. Atomic Habits – James Clear</h2>
        <p>Sách tập trung vào sức mạnh của những thay đổi nhỏ mỗi ngày. Thay vì cố gắng tạo cú hích lớn, tác giả chỉ ra cách xây dựng hệ thống thói quen giúp bạn tiến bộ bền vững trong công việc và cuộc sống.</p>

        <h2>2. Thinking, Fast and Slow – Daniel Kahneman</h2>
        <p>Tác phẩm kinh điển về tâm lý học hành vi, giải thích hai hệ thống tư duy nhanh và chậm của con người. Hiểu được cách mình ra quyết định giúp nhà lãnh đạo giảm sai lầm và tối ưu chiến lược kinh doanh.</p>

        <h2>3. Good to Great – Jim Collins</h2>
        <p>Nghiên cứu sâu về những doanh nghiệp chuyển mình từ “tốt” trở thành “vĩ đại”. Cuốn sách nêu ra các yếu tố cốt lõi như vai trò của “con người phù hợp”, văn hóa kỷ luật và tư duy con nhím.</p>

        <p>Ngoài ba đầu sách tiêu biểu trên, danh sách còn bao gồm nhiều tựa sách về lãnh đạo, đổi mới sáng tạo, quản trị tài chính và xây dựng thương hiệu. Điểm chung là đều mang tính thực tiễn cao, có thể áp dụng trực tiếp vào công việc kinh doanh hằng ngày.</p>

        <p>Nếu bạn đang muốn nâng tầm tư duy quản lý hoặc chuẩn bị khởi nghiệp, hãy chọn ít nhất 1–2 cuốn trong danh sách này để đọc thật kỹ và ghi chép lại những ý có thể triển khai ngay.</p>
      `,
      author: "Nguyễn Văn A",
      publishDate: "2024-01-15",
      category: "Kinh doanh",
      tags: ["kinh doanh", "sách hay", "2024"],
      readTime: 8,
      image: "/business-books.png",
    },
    {
      id: "2",
      title: "Cách Xây Dựng Thói Quen Đọc Sách Hiệu Quả",
      excerpt:
        "Từ con số 0 đến thói quen đọc 30 phút mỗi ngày – hoàn toàn khả thi nếu bạn đi đúng từng bước.",
      content: `
        <p>Rất nhiều người biết đọc sách quan trọng nhưng lại không duy trì được thói quen lâu dài. Vài ngày đầu còn hứng thú, sau đó bận rộn, mệt mỏi và… bỏ dở. Vấn đề không nằm ở việc bạn lười, mà là hệ thống thói quen chưa được thiết kế đúng.</p>

        <h2>1. Xác định lý do đủ mạnh</h2>
        <p>Đừng đọc sách chỉ vì “mọi người đều bảo nên đọc”. Hãy trả lời rõ ràng: bạn đọc để làm gì? Thăng tiến công việc, cải thiện tài chính, nuôi dạy con tốt hơn hay đơn giản là giảm stress? Lý do càng cụ thể, động lực càng bền.</p>

        <h2>2. Bắt đầu cực nhỏ</h2>
        <p>Thay vì đặt mục tiêu 30–60 phút ngay từ đầu, hãy bắt đầu với 5–10 phút mỗi ngày. Quan trọng là bạn xuất hiện liên tục, không bỏ ngày nào. Thói quen hình thành trước, thời lượng tăng dần sau.</p>

        <h2>3. Biến việc đọc thành “nghi lễ” cố định</h2>
        <p>Chọn một khung giờ cố định: trước khi ngủ, lúc chờ xe buýt, sau bữa tối… và luôn dùng khoảng thời gian đó cho việc đọc. Khi não quen với “trình tự”, bạn sẽ ít phải đấu tranh với sự trì hoãn hơn.</p>

        <h2>4. Chọn đúng sách với giai đoạn hiện tại</h2>
        <p>Nếu mới bắt đầu, đừng chọn những cuốn quá học thuật hoặc dày hàng trăm trang. Hãy chọn sách dễ đọc, nhiều ví dụ, liên quan trực tiếp tới vấn đề bạn đang gặp. Cảm giác “đọc xong và áp dụng được” sẽ tạo động lực rất lớn.</p>

        <h2>5. Ghi chép và áp dụng ngay</h2>
        <p>Mỗi lần đọc, hãy ghi lại 1–3 ý bạn thấy tâm đắc và chọn ít nhất một ý để thử nghiệm trong ngày hoặc trong tuần. Khi sách gắn với kết quả thực tế, bạn sẽ tự nhiên muốn đọc nhiều hơn.</p>

        <p>Thói quen đọc sách không phải thứ có được trong một đêm, nhưng chỉ cần kiên trì vài tuần với những bước trên, bạn sẽ ngạc nhiên vì mình thay đổi nhanh thế nào.</p>
      `,
      author: "Trần Thị B",
      publishDate: "2024-01-10",
      category: "Kỹ năng sống",
      tags: ["đọc sách", "thói quen", "phát triển bản thân"],
      readTime: 6,
      image: "/diverse-reading-habits.png",
    },
    {
      id: "3",
      title: "Review: Sapiens – Cuốn Sách Thay Đổi Cách Nhìn Về Lịch Sử",
      excerpt:
        "Không chỉ kể lại lịch sử loài người, Sapiens còn đặt câu hỏi: chúng ta đang đi đâu và muốn trở thành ai?",
      content: `
        <p><em>Sapiens</em> của Yuval Noah Harari không phải là một cuốn sách lịch sử theo kiểu niên biểu khô khan. Tác giả nhìn lại toàn bộ hành trình của loài người – từ thời săn bắt hái lượm đến kỷ nguyên trí tuệ nhân tạo – dưới góc nhìn của sinh học, kinh tế, tôn giáo và chính trị.</p>

        <h2>1. Ba cuộc cách mạng định hình loài người</h2>
        <p>Harari cho rằng lịch sử loài người xoay quanh ba cuộc cách mạng: Cách mạng Nhận thức, Cách mạng Nông nghiệp và Cách mạng Khoa học. Mỗi bước nhảy vọt đều mang lại tiến bộ nhưng cũng kéo theo những cái giá không hề nhỏ.</p>

        <h2>2. Sức mạnh của “câu chuyện tưởng tượng”</h2>
        <p>Một luận điểm rất mạnh trong sách: con người có thể hợp tác linh hoạt ở quy mô lớn nhờ những câu chuyện tưởng tượng – như tiền tệ, quốc gia, luật pháp, tôn giáo. Chúng không tồn tại hữu hình nhưng lại chi phối hành vi của hàng triệu người.</p>

        <h2>3. Góc nhìn tỉnh táo về chủ nghĩa tiêu dùng</h2>
        <p>Tác giả đặt câu hỏi: chúng ta có thực sự hạnh phúc hơn tổ tiên khi làm việc nhiều giờ mỗi ngày chỉ để mua thêm đồ? Sự “phát triển” về vật chất đôi khi không tỷ lệ thuận với chất lượng đời sống tinh thần.</p>

        <h2>4. Có nên đọc Sapiens?</h2>
        <p>Đây là cuốn sách không dễ đọc nhanh, nhưng cực kỳ đáng đọc. Nếu bạn muốn có cái nhìn rộng hơn về vị trí của mình trong dòng chảy lịch sử và hiểu vì sao thế giới vận hành như hiện tại, Sapiens là lựa chọn gần như bắt buộc.</p>

        <p>Sau khi gấp sách lại, câu hỏi còn đọng lại không phải là “con người đã đi từ đâu đến”, mà là “chúng ta sẽ chọn đi đâu tiếp theo”.</p>
      `,
      author: "Lê Văn C",
      publishDate: "2024-01-05",
      category: "Review sách",
      tags: ["sapiens", "lịch sử", "review"],
      readTime: 10,
      image: "/sapiens-book-cover.png",
    },
    {
      id: "4",
      title: "Xu Hướng Đọc Sách Điện Tử Trong Thời Đại Số",
      excerpt:
        "Ebook, audiobook và những nền tảng đọc trực tuyến đang thay đổi hoàn toàn thói quen đọc của độc giả.",
      content: `
        <p>Cùng với sự bùng nổ của smartphone và tablet, việc đọc sách không còn bó buộc vào giấy in. Ngày càng nhiều độc giả chuyển sang ebook, audiobook hoặc các ứng dụng đọc sách online vì sự tiện lợi và chi phí hợp lý.</p>

        <h2>1. Ưu điểm của sách điện tử</h2>
        <ul>
          <li><strong>Tiện mang theo:</strong> Chỉ với một thiết bị, bạn có thể mang theo hàng trăm cuốn sách.</li>
          <li><strong>Giá mềm:</strong> Ebook thường rẻ hơn bản giấy, nhiều cuốn còn miễn phí hoặc được giảm giá theo đợt.</li>
          <li><strong>Tính năng hỗ trợ:</strong> Tra từ điển nhanh, highlight, ghi chú, đồng bộ giữa các thiết bị…</li>
        </ul>

        <h2>2. Audiobook – giải pháp cho người bận rộn</h2>
        <p>Nghe sách khi lái xe, nấu ăn hay tập thể dục giúp tận dụng những khoảng thời gian “chết” trong ngày. Đây là xu hướng đang tăng mạnh trên toàn thế giới.</p>

        <h2>3. Có phải sách giấy sẽ “chết”?</h2>
        <p>Thực tế, sách giấy vẫn có chỗ đứng riêng nhờ cảm giác cầm nắm, mùi giấy, khả năng tập trung tốt hơn. Thay vì loại trừ nhau, sách giấy và sách điện tử đang cùng tồn tại, phục vụ những nhu cầu khác nhau.</p>

        <p>Điều quan trọng không phải là bạn đọc trên thiết bị nào, mà là bạn có duy trì được việc đọc đều đặn và biến kiến thức trong sách thành hành động cụ thể hay không.</p>
      `,
      author: "Phạm Thị D",
      publishDate: "2024-01-01",
      category: "Công nghệ",
      tags: ["ebook", "audiobook", "thời đại số"],
      readTime: 7,
      image: "/digital-reading.png",
    },
    {
      id: "5",
      title: "Top 5 Tác Giả Việt Nam Được Độc Giả Yêu Thích Nhất",
      excerpt:
        "Một hành trình ngắn dọc theo văn học Việt qua những cái tên đã chạm được tới trái tim nhiều thế hệ độc giả.",
      content: `
        <p>Văn học Việt Nam sở hữu rất nhiều cây bút tài năng, mỗi người mang đến một giọng văn, một thế giới riêng. Danh sách dưới đây không nhằm “xếp hạng”, mà gợi ý vài cái tên tiêu biểu để bạn bắt đầu hoặc quay lại với văn học Việt.</p>

        <h2>1. Nguyễn Nhật Ánh</h2>
        <p>Được mệnh danh là “người kể chuyện tuổi thơ”, các tác phẩm như <em>Cho tôi xin một vé đi tuổi thơ</em>, <em>Mắt biếc</em>… đã gắn liền với nhiều thế hệ độc giả trẻ.</p>

        <h2>2. Nguyễn Ngọc Tư</h2>
        <p>Văn của chị mộc mạc mà day dứt, phản ánh đời sống miền Tây sông nước với nhiều số phận nhỏ bé nhưng đầy nhân phẩm. <em>Cánh đồng bất tận</em> là tác phẩm không thể bỏ qua.</p>

        <h2>3. Bùi Ngọc Tấn, Nam Cao, Tô Hoài…</h2>
        <p>Mỗi tác giả đại diện cho một giai đoạn, một lát cắt xã hội khác nhau, giúp người đọc hiểu hơn về lịch sử và con người Việt Nam.</p>

        <p>Nếu lâu rồi bạn chưa đọc văn học Việt, hãy thử chọn một cuốn trong danh sách trên. Biết đâu bạn sẽ tìm lại được cảm giác vừa quen vừa lạ trong chính ngôn ngữ mẹ đẻ của mình.</p>
      `,
      author: "Hoàng Văn E",
      publishDate: "2023-12-28",
      category: "Văn học Việt",
      tags: ["văn học Việt", "tác giả", "gợi ý sách"],
      readTime: 9,
      image: "/vietnamese-authors.png",
    },
    {
      id: "6",
      title: "Cách Chọn Sách Phù Hợp Với Từng Độ Tuổi",
      excerpt:
        "Chọn đúng sách cho đúng giai đoạn phát triển giúp trẻ yêu sách tự nhiên thay vì bị ép đọc.",
      content: `
        <p>Muốn trẻ thích đọc sách, bước đầu tiên là chọn sách phù hợp với độ tuổi và khả năng tiếp nhận. Một cuốn sách quá khó sẽ khiến trẻ chán nản, còn quá dễ thì nhanh chóng nhàm chán.</p>

        <h2>1. Mầm non (3–6 tuổi)</h2>
        <p>Nên ưu tiên sách tranh nhiều hình, ít chữ, màu sắc tươi sáng. Nội dung xoay quanh đồ vật quen thuộc, cảm xúc cơ bản và các kỹ năng tự lập đơn giản.</p>

        <h2>2. Tiểu học (6–11 tuổi)</h2>
        <p>Đây là giai đoạn vàng để xây dựng thói quen đọc. Hãy kết hợp truyện tranh, truyện chữ đơn giản, sách khoa học khám phá, truyện danh nhân, truyện ngụ ngôn hiện đại.</p>

        <h2>3. THCS &amp; THPT</h2>
        <p>Có thể giới thiệu tiểu thuyết dài hơi, sách kỹ năng mềm, sách định hướng nghề nghiệp, sách tâm lý tuổi teen. Quan trọng là lắng nghe mối quan tâm của trẻ thay vì áp đặt hoàn toàn.</p>

        <h2>4. Gợi ý cho phụ huynh</h2>
        <ul>
          <li>Cùng đọc với con, đừng chỉ “ra lệnh phải đọc”.</li>
          <li>Cho con quyền tự chọn trong một danh sách đã được lọc trước.</li>
          <li>Khen nỗ lực đọc, không chỉ khen “điểm số” hay “thành tích”.</li>
        </ul>

        <p>Khi sách gắn với niềm vui và sự thấu hiểu, trẻ sẽ chủ động tìm đến sách chứ không cần cha mẹ phải nhắc nhở quá nhiều.</p>
      `,
      author: "Nguyễn Thị F",
      publishDate: "2023-12-25",
      category: "Giáo dục",
      tags: ["giáo dục", "trẻ em", "chọn sách"],
      readTime: 8,
      image: "/colorful-childrens-books.png",
    },
  ]

  return posts.find((post) => post.id === id) || null
}


interface BlogDetailPageProps {
  params: {
    id: string
  }
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const foundPost = getBlogPost(params.id)
    setPost(foundPost)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => router.push("/blog")}>Quay lại blog</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* Article Header */}
      <article className="space-y-6">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <Badge className="bg-blue-500 hover:bg-blue-600">{post.category}</Badge>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.publishDate).toLocaleDateString("vi-VN")}
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {post.author}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime} phút đọc
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight">{post.title}</h1>

          <p className="text-xl text-gray-600 leading-relaxed">{post.excerpt}</p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Yêu thích
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-6 border-t">
          <span className="text-sm font-medium text-gray-700">Tags:</span>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Author Info */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{post.author}</h3>
                <p className="text-gray-600">
                  Chuyên gia trong lĩnh vực {post.category.toLowerCase()}, có nhiều năm kinh nghiệm và đam mê chia sẻ
                  kiến thức.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Bài viết liên quan
            </h3>
            <div className="space-y-4">
              <Link href="/blog/2" className="block hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <h4 className="font-medium text-gray-900 hover:text-blue-600">
                  Cách Xây Dựng Thói Quen Đọc Sách Hiệu Quả
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Hướng dẫn chi tiết để phát triển thói quen đọc sách bền vững...
                </p>
              </Link>
              <Link href="/blog/3" className="block hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <h4 className="font-medium text-gray-900 hover:text-blue-600">
                  Review: Sapiens - Cuốn Sách Thay Đổi Cách Nhìn Về Lịch Sử
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Đánh giá chi tiết về cuốn sách Sapiens của Yuval Noah Harari...
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
