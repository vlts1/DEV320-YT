import { faStar } from "@fortawesome/free-solid-svg-icons";
import { PageTitle, PageTitleIcon } from "../styles";

export const Profile = () => {
    return (
        <div>
            <PageTitle>Profile<PageTitleIcon icon={faStar}/> </PageTitle>
        </div>
    );
};