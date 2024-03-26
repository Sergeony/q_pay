import React, { memo, useCallback, useMemo } from "react";
import { ThemeToggle } from "features/ThemeToggle";
import { LangSelect } from "features/LangSelect";
import { useTranslation } from "react-i18next";
import { BalanceBlock } from "entities/Balance";
import { getRoutePay } from "shared/const/router";
import { AppLogo } from "shared/AppLogo/AppLogo";
import {
    getDepositTransactions,
    getWithdrawalTransactions,
} from "entities/Transaction";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { getUserData } from "entities/User";
import { useNavLinks } from "../lib/getNavLinks";
import cls from "./Header.module.scss";

export const Header = memo(() => {
    const { t } = useTranslation();
    const userData = useSelector(getUserData);
    const navLinks = useNavLinks(userData?.type);
    const dat = useSelector(getDepositTransactions) || [];
    const wat = useSelector(getWithdrawalTransactions) || [];
    const location = useLocation();

    const getIsActive = useCallback(
        (match: string) => location.pathname.includes(match),
        [location.pathname]
    );

    const navLinkElements = useMemo(
        () => navLinks.map((nl) => (
            <li key={nl.path} className="pos-rel">
                <NavLink
                    to={nl.path}
                    className={({ isActive }) => `${(nl.match
                        ? getIsActive(nl.match)
                        : isActive) && cls.active} ${cls.NavLink}`}
                >
                    {t(nl.text)}
                </NavLink>
                {dat.length > 0 && nl.path.includes(getRoutePay("in")) && (
                    <span className={cls.circle}>{dat.length}</span>
                )}
                {wat.length > 0 && nl.path.includes(getRoutePay("out")) && (
                    <span className={cls.circle}>{wat.length}</span>
                )}
            </li>
        )),
        [dat.length, getIsActive, navLinks, t, wat.length]
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
                                    {/* TODO: replace TO path when implemented */}
                                    <NavLink to="balance">
                                        <BalanceBlock />
                                    </NavLink>
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
