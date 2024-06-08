import React, { memo, useMemo } from "react";
import { ThemeToggle } from "features/ThemeToggle";
import { LangSelect } from "features/LangSelect";
import { useTranslation } from "react-i18next";
import { BalanceBlock } from "entities/Balance";
import { AppLogo } from "shared/AppLogo/AppLogo";
import {
    getDepositTransactions,
    getWithdrawalTransactions,
} from "entities/Transaction";
import { useSelector } from "react-redux";
import { getUserData } from "entities/User";
import { AppNavLink } from "shared/ui/AppNavLink/AppNavLink";
import { getRouteBalance, getRoutePay } from "shared/const/router";
import { useNavLinks } from "../lib/getNavLinks";
import cls from "./Header.module.scss";

export const Header = memo(() => {
    const { t } = useTranslation();
    const userData = useSelector(getUserData);
    const navLinks = useNavLinks(userData?.type);
    const dat = useSelector(getDepositTransactions) || [];
    const wat = useSelector(getWithdrawalTransactions) || [];

    const navLinkElements = useMemo(
        () => navLinks.map((nl) => (
            <li key={nl.path} className="pos-rel">
                <AppNavLink
                    to={nl.path}
                    variant="header"
                    match={nl.match}
                    title={t(nl.text)}
                >
                    {t(nl.text)}
                </AppNavLink>
                {
                    dat.length > 0
                    && nl.path.includes(getRoutePay("in", ":payTab").replace(":tab", ""))
                    && (<span className={cls.circle}>{dat.length}</span>)
                }
                {
                    wat.length > 0
                    && nl.path.includes(getRoutePay("out", ":payTab").replace(":tab", ""))
                    && (<span className={cls.circle}>{wat.length}</span>)
                }
            </li>
        )),
        [dat.length, navLinks, t, wat.length]
    );

    return (
        <header>
            <div className={`${cls.Content} h-stack justifyBetween gap-32 alignCenter`}>
                <div className="h-stack gap-32 alignCenter">
                    <AppLogo />
                    <ThemeToggle className={cls.ThemeToggle} />
                </div>
                <div className={`${cls.RightSide} h-stack gap-32 alignCenter`}>
                    {navLinks.length > 0 && (
                        <nav>
                            <ul className={`h-stack justifyBetween alignCenter ${cls.NavList}`}>
                                {navLinkElements}
                                <li>
                                    <AppNavLink
                                        to={getRouteBalance()}
                                        title={t("balance_page_title")}
                                    >
                                        <BalanceBlock />
                                    </AppNavLink>
                                </li>
                            </ul>
                        </nav>
                    )}
                    <LangSelect />
                </div>
            </div>
        </header>
    );
});
