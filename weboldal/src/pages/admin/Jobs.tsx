import AdminListPage from "@/components/AdminListPage";

/**
 * Munkák listázásáért felelős komponens, amely az adminisztrátorok számára lehetővé teszi
 * a rendszerben található munkák megtekintését.
 *
 * A komponens az `AdminListPage` komponenst használja a munkák listázásához.
 * Az `AdminListPage`-nek átadott `listUsers` prop értéke `false`, amely jelzi, hogy nem felhasználók, hanem munkák listázása történjen.
 *
 * @component
 */
export default function Jobs(){
    return (
        <AdminListPage listUsers={false}/>
    )
}