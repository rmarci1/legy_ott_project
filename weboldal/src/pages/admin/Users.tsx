import AdminListPage from "@/components/AdminListPage";
/**
 * Felhasználók listázásáért felelős komponens, amely az adminisztrátorok számára lehetővé teszi
 * a rendszer felhasználóinak megtekintését.
 *
 * A komponens az `AdminListPage` komponenst használja a felhasználók listázásához.
 * Az `AdminListPage`-nek átadott `listUsers` prop értéke `true`, amely jelzi, hogy a felhasználók listázása történjen.
 *
 * @component
 */
export default function Users() {
   return (
      <AdminListPage listUsers={true}/>
    )
  }
