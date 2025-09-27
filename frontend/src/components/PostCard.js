import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function PostCard({ author, course, title, content, likes, comments, shares, }) {
    return (_jsxs("div", { className: "post-card", children: [_jsx("h4", { children: title }), _jsxs("p", { className: "author", children: [author, " \u2013 ", _jsx("span", { children: course })] }), _jsx("p", { children: content }), _jsxs("div", { className: "post-actions", children: [_jsxs("span", { children: ["\uD83D\uDC4D ", likes] }), _jsxs("span", { children: ["\uD83D\uDCAC ", comments] }), _jsxs("span", { children: ["\u2197 ", shares] })] })] }));
}
//# sourceMappingURL=PostCard.js.map