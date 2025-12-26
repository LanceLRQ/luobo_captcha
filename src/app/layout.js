import "./globals.css";

export const metadata = {
  title: "萝卜纸巾验证码",
  description: "萝卜纸巾验证码",
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
