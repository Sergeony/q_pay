import { UserType } from "entities/User";
import {
    getRoutePay, getRouteSettings, getRouteAds, getRouteAdminUsers
} from "shared/const/router";
import { TransactionStatusGroup } from "entities/Transaction";

interface NavLinkType {
    path: string;
    text: string;
    match?: string;
}

export const useNavLinks = (userType: UserType | undefined) => {
    const navLinks: NavLinkType[] = [];

    if (!userType) return [];

    // Trader only nav links
    if (userType === UserType.TRADER) {
        navLinks.push(
            {
                path: getRouteAds(),
                text: "ads_page_title",
            },
        );
    }

    // Common links for traders and merchants
    if ([UserType.TRADER, UserType.MERCHANT].includes(userType)) {
        navLinks.push(
            {
                path: getRoutePay("in", TransactionStatusGroup.ACTIVE),
                text: "pay_in_page_title",
                match: getRoutePay("in", ":payTab").replace(":tab", ""),
            },
            {
                path: getRoutePay("out", TransactionStatusGroup.ACTIVE),
                text: "pay_out_page_title",
                match: getRoutePay("out", ":payTab").replace(":tab", "")
            },
        );
    } else if (userType === UserType.ADMIN) {
        navLinks.push(
            {
                path: getRouteAdminUsers("traders"),
                text: "admin_traders_page_title",
            },
            {
                path: getRouteAdminUsers("merchants"), // TODO: replace with settings page
                text: "admin_merchants_page_title",
            },
        );
    }

    // Common links for all the user types
    navLinks.push(
        {
            path: getRouteSettings(), // TODO: replace with settings page
            text: "settings_page_title",
        },
    );

    return navLinks;
};
