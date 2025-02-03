import { Job } from "../Types/Job";

export default function JobCard(Job: Job){

    return<>
        <div className="block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark">
            <img className="rounded-t-lg" src={Job.img} />
            <div className="p-6 text-surface dark:text-white">
                <h5 className="mb-2 text-xl font-medium leading-tight">{Job.name}</h5>
                <p className="mb-4 text-base">
                    {Job.description}
                </p>
                <button
                type="button"
                className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                data-twe-ripple-init
                data-twe-ripple-color="light">
                    További információ
                </button>
            </div>
        </div>
    </>
}