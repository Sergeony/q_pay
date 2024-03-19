import { useSelector } from "react-redux";
import { getUserData, UserType } from "entities/User";
import { getRouteTraderAds, getRouteTraderPayIn } from "shared/const/router";

interface NavLinkType {
    path: string;
    text: string;
}

export const useNavLinks = () => {
    const userData = useSelector(getUserData);

    if (!userData) {
        return [];
    }

    const navLinks: NavLinkType[] = [];

    if (userData.type === UserType.TRADER) {
        navLinks.push(
            {
                path: getRouteTraderAds(),
                text: "ads_page_title",
            },
            {
                path: getRouteTraderPayIn(),
                text: "pay_in_page_title",
            },
        );
    } else if (userData.type === UserType.MERCHANT) {
        // navLinks.push();
    } else if (userData.type === UserType.ADMIN) {
        // navLinks.push();
    }

    navLinks.push(
        {
            // path: getRouteSettings(),
            path: getRouteTraderAds(), // TODO: replace with settings page
            text: "settings_page_title",
        },
    );

    return navLinks;
};
