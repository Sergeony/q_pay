import React, { memo, useMemo } from "react";
import { ThemeToggle } from "features/ThemeToggle";
import { LangSelect } from "features/LangSelect";
import { useTranslation } from "react-i18next";
import { classNames } from "shared/lib/classNames/classNames";
import { BalanceBlock } from "entities/Balance";
import { Link } from "shared/ui/Link/Link";
import { getRouteTraderAds } from "shared/const/router";
import { AppLogo } from "shared/AppLogo/AppLogo";
import { useNavLinks } from "../lib/getNavLinks";
import cls from "./Header.module.scss";

interface IProps {
    className?: string;
}

export const Header = memo(() => {
    const { t } = useTranslation();
    const navLinks = useNavLinks();

    const navLinkElements = useMemo(
        () => navLinks.map((nl) => (
            <Link
                to={nl.path}
                className={cls.NavLink}
                activeClassName={cls.active}
            >
                {t(nl.text)}
            </Link>
        )),
        [navLinks, t]
    );

    return (
        <header>
            <div className={classNames(
                cls.Content,
                ["h-stack", "justifyBetween gap-32 alignCenter"]
            )}
            >
                <div className="h-stack gap-32 alignCenter">
                    <AppLogo />
                    <ThemeToggle className={cls.ThemeToggle} />
                </div>
                <div className={classNames(cls.RightSide, ["h-stack gap-32 alignCenter"])}>
                    {navLinks && (
                        <nav
                            className={classNames(
                                cls.Nav,
                                ["h-stack justifyBetween alignCenter"]
                            )}
                        >
                            {navLinkElements}
                            <Link
                                to={getRouteTraderAds()}
                            >
                                <BalanceBlock />
                            </Link>
                        </nav>
                    )}
                    <LangSelect />
                </div>
            </div>
        </header>
    );
});
