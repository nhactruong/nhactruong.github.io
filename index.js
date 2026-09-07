/**
 * Tương tác của hồ sơ: đánh dấu menu và chat mô phỏng, không gọi API.
 * IIFE cô lập biến để không xung đột với script khác khi mở rộng website.
 * Script dùng defer trong HTML nên DOM đã sẵn sàng khi khởi tạo.
 */
(() => {
  "use strict";

  /**
   * Chuẩn hoá để cùng hiểu “KHỎE”, “khoẻ” và “khoe”.
   * Chỉ dùng bản chuẩn hoá để xét quy tắc; tin nhắn hiển thị vẫn giữ nguyên.
   * Đổi dấu câu thành khoảng trắng và xét ranh giới từ tránh “hi” khớp “khi”.
   */
  function normalizeMessage(message) {
    return message.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Quy tắc ưu tiên: tạm biệt → sức khoẻ → chào hỏi.
   * “Chào bạn, khoẻ không?” trả Thank you; “chào tạm biệt” trả Good bye!.
   * Đây là nhận diện từ/cụm từ, chưa có khả năng hiểu ngôn ngữ như AI thật.
   * Muốn bổ sung cách diễn đạt, sửa pattern của nhóm tương ứng tại đây.
   */
  const replyRules = [
    { pattern: /\b(tam biet|chao tam biet|hen gap lai|bye|good\s?bye|see you)\b/, reply: "Good bye!" },
    { pattern: /\b(khoe|suc khoe|how are you|how do you feel|how are things)\b/, reply: "Thank you" },
    { pattern: /\b(chao|hello|hi|hey|good morning|good afternoon|good evening)\b/, reply: "Hello" },
  ];

  /** Hàm thuần: mỗi tin nhắn được xét độc lập, lời tạm biệt không kết thúc phiên. */
  function getMockReply(message) {
    const normalized = normalizeMessage(message);
    return replyRules.find(({ pattern }) => pattern.test(normalized))?.reply
      ?? "Mình đang ở chế độ mô phỏng. Bạn thử chào hỏi, hỏi thăm sức khoẻ hoặc nói lời tạm biệt nhé.";
  }

  /**
   * Theo dõi section bằng IntersectionObserver, không gắn xử lý vào mỗi pixel cuộn.
   * Giữ tập section đang thấy; đọc vị trí hiện tại thay vì dùng tọa độ đã cũ.
   */
  function initNavigation() {
    const navigation = document.querySelector(".site-nav");
    if (!navigation) return;
    const links = [...navigation.querySelectorAll(".site-nav__link")];
    const sections = [...document.querySelectorAll(".observed-section")];
    let activeId;

    function setActiveLink(id) {
      if (id === activeId) return;
      activeId = id;
      links.forEach((link) => {
        if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    setActiveLink(sections.find((section) => `#${section.id}` === location.hash)?.id ?? sections[0]?.id);
    navigation.addEventListener("click", (event) => {
      const link = event.target.closest(".site-nav__link");
      if (link) setActiveLink(link.hash.slice(1));
    });
    if (!("IntersectionObserver" in window)) return;

    const visibleSections = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) visibleSections.add(target);
        else visibleSections.delete(target);
      });
      let nearestSection;
      let nearestDistance = Infinity;
      visibleSections.forEach((section) => {
        const distance = Math.abs(section.getBoundingClientRect().top);
        if (distance < nearestDistance) {
          nearestSection = section;
          nearestDistance = distance;
        }
      });
      if (nearestSection) setActiveLink(nearestSection.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  /** Cache DOM một lần; nếu thiếu thành phần chat thì phần còn lại của web vẫn chạy. */
  function initChat() {
    const toggle = document.querySelector("#ai-toggle");
    const panel = document.querySelector("#ai-chat");
    const close = document.querySelector("#ai-close");
    const form = document.querySelector("#ai-form");
    const input = document.querySelector("#ai-input");
    const messages = document.querySelector("#ai-messages");
    if (!toggle || !panel || !close || !form || !input || !messages) return;

    /** Đồng bộ trạng thái nhìn thấy và aria; trả focus về nút mở khi đóng. */
    function setChatOpen(isOpen) {
      panel.hidden = !isOpen;
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI");
      (isOpen ? input : toggle).focus({ preventScroll: true });
    }

    /** textContent hiển thị văn bản an toàn, không thực thi HTML người dùng nhập. */
    function createMessage(text, role) {
      const message = document.createElement("div");
      message.className = `ai-message ai-message--${role}`;
      message.textContent = text;
      return message;
    }

    toggle.addEventListener("click", () => setChatOpen(panel.hidden));
    close.addEventListener("click", () => setChatOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !event.isComposing && !panel.hidden) {
        setChatOpen(false);
      }
    });

    /**
     * Trả lời đồng bộ: không timer, fetch hay khoá nút gửi, nên chat liên tục được.
     * Ghép hai tin nhắn rồi cuộn một lần, giảm số lần tính layout mỗi lượt.
     * Không tạo thêm mảng lịch sử trùng với DOM; đóng/mở vẫn giữ nội dung,
     * tải lại trang sẽ xoá cuộc trò chuyện (không lưu dữ liệu người dùng).
     */
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) {
        input.focus();
        return;
      }
      messages.append(createMessage(text, "user"), createMessage(getMockReply(text), "assistant"));
      input.value = "";
      messages.scrollTop = messages.scrollHeight;
      input.focus({ preventScroll: true });
    });

    /** Enter gửi, Shift+Enter xuống dòng; không gửi giữa lúc bộ gõ đang ghép chữ. */
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  }

  initNavigation();
  initChat();
})();
