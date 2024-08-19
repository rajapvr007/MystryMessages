"use client";
import { useSession, signIn, signOut } from "next-auth/react";

// export default function Component() {
//   const { data: session } = useSession();
// }

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        Singed in as {session.user.email} <br />
        <button onClick={() => signOut()}> Sing Out</button>
      </div>
    );
  } else {
    return (
      <div>
        Not Signed in <br />
        <button className="bg-orange-500 px-3 rounded" onClick={() => signIn()}>
          Sign In
        </button>
      </div>
    );
  }
}

// if (session) {
//   return (
//     <>
//       Signed in as {session.user.email} <br />
//       <button onClick={() => signOut()}>Sign out</button>
//     </>
//   );
// }
// return (
//   <>
//     Not signed in <br />
//     <button className="bg-red-500 p-3 rounded-full" onClick={() => signIn()}>
//       Sign in
//     </button>
//   </>
// );
