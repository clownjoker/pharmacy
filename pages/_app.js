// pages/_app.js
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";
import { InventoryProvider } from "../context/InventoryContext";
import { ShiftProvider } from "../context/ShiftContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <InventoryProvider>
        <ShiftProvider>
          <>
            <Toaster position="top-center" />
            <Component {...pageProps} />
          </>
        </ShiftProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}















// // pages/_app.js
// import "../styles/globals.css";
// import { useRouter } from "next/router";
// import AuthGuard from "../components/AuthGuard";
// import { InventoryProvider } from "../context/InventoryContext";

// export default function MyApp({ Component, pageProps }) {
//   const router = useRouter();

//   const publicRoutes = ["/"]; // صفحة تسجيل الدخول مثلاً
//   const isPublic = publicRoutes.includes(router.pathname);

//   if (isPublic) {
//     return (
//       <InventoryProvider>
//         <Component {...pageProps} />
//       </InventoryProvider>
//     );
//   }

//   return (
//     <InventoryProvider>
//       <AuthGuard>
//         <Component {...pageProps} />
//       </AuthGuard>
//     </InventoryProvider>
//   );
// }



















// import '../styles/globals.css'
// import { useRouter } from 'next/router'
// import AuthGuard from '../components/AuthGuard'

// export default function MyApp({ Component, pageProps }) {
//   const router = useRouter()

//   // المسارات العامة
//   const publicRoutes = ['/']

//   const isPublic = publicRoutes.includes(router.pathname)

//   if (isPublic) {
//     return <Component {...pageProps} />
//   }

//   return (
//     <AuthGuard>
//       <Component {...pageProps} />
//     </AuthGuard>
//   )
// }





// // pages/_app.js
// import '../styles/globals.css'
// import { useRouter } from 'next/router'
// import AuthGuard from '../components/AuthGuard'

// export default function MyApp({ Component, pageProps }) {
//   const router = useRouter()

//   // المسارات المسموح الوصول لها بدون تسجيل دخول
//   const publicRoutes = ['/']

//   const isPublic = publicRoutes.includes(router.pathname)

//   if (isPublic) {
//     return <Component {...pageProps} />
//   }

//   return (
//     <AuthGuard>
//       <Component {...pageProps} />
//     </AuthGuard>
//   )
// }










// // pages/_app.js
// import '../styles/globals.css'

// import { Toaster } from 'react-hot-toast'

// export default function MyApp({ Component, pageProps }) {
//   return (
//     <>
//       {/* ✅ مكوّن التوستر العام */}
//       <Toaster
//         position="top-left"
//         toastOptions={{
//           duration: 3000,
//           style: { fontFamily: 'Tajawal, sans-serif', direction: 'rtl' },
//           success: {
//             iconTheme: {
//               primary: '#10B981',
//               secondary: 'white',
//             },
//           },
//           error: {
//             iconTheme: {
//               primary: '#EF4444',
//               secondary: 'white',
//             },
//           },
//         }}
//       />
//       <Component {...pageProps} />
//     </>
//   )
// }




// // pages/_app.js
// import '../styles/globals.css' // استيراد تنسيقات Tailwind
// import { Tajawal } from 'next/font/google'

// // تحميل الخط من Google
// const tajawal = Tajawal({
//   subsets: ['arabic'],
//   weight: ['400', '500', '700']
// })

// export default function MyApp({ Component, pageProps }) {
//   return (
//     <div className={tajawal.className}>
//       <Component {...pageProps} />
//     </div>
//   )
// }
