/**
 * A statisztikához kellő adatokat reprezentáló objektum.
 */
export interface DashBoardData{
    /** Össz felhasználók száma */
    userCount : number,
    /** Múlt heti össz felhasználók száma */
    userCountPastWeek : number,
    /** Össz lehetőségek száma */
    jobCount : number,
    /** Múlt heti össz lehetőségek száma */
    jobCountPastWeek : number,
    /** Ezen a héten csatlakozott felhasználók száma*/
    thisWeekUserCount : number,
    /** Előző héten csatlakozott felhasználók száma */
    pastWeekUserCount : number,
    /** Előző 1 hétben lévő napi szinten lévő felhasználói változások a gráfhoz*/
    weekDailyCounts : number[],
    /** Ebben a hónapban csatlakozott felhasználók száma*/
    thisMonthUserCount : number,
    /** Előző hónapban csatlakozott felhasználók száma */
    pastMonthUserCount : number,
    /** Ebben a hónapban létrehozott lehetőségek száma*/
    thisMonthJobCount : number,
    /** Előző hónapban létrehozott lehetőségek száma*/
    pastMonthJobCount : number,
    /** Ebben a hónapban megtörtént lehetőségek száma*/
    thisMonthClosedJobs : number,
    /** Előző hónapban megtörtént lehetőségek száma*/
    pastMonthClosedJobs : number,
}
