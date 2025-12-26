import "./globals.css";

export const metadata = {
  title: "图形验证码 Demo",
  description: "模仿 Google reCAPTCHA 样式的本地验证码演示",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
