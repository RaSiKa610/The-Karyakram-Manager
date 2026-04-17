import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Define allowed roles for the admin dashboard
  const userRole = (session.user as any)?.role;
  const allowedRoles = ["ADMIN", "HOST"];

  if (!allowedRoles.includes(userRole)) {
    // If attendee tries to access admin panel, kick them back to normal event page
    redirect("/events");
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            {userRole} Portal
          </p>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>
            <span>📊</span> Dashboard
          </Link>
          <Link href="/events/manage" className={styles.navLink}>
            <span>🎫</span> Manage Events
          </Link>
          <Link href="/events/new" className={styles.navLink}>
            <span>➕</span> Create Event
          </Link>
          <Link href="/attendees" className={styles.navLink}>
            <span>👥</span> Attendees (Soon)
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
