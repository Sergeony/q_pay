import { ReactNode, FC, memo } from "react";

interface TableProps {
    children: ReactNode;
}

export const Table = memo((props: TableProps) => {
    const {
        children,
        ...otherProps
    } = props;

    const t = (value: string) => "";

    return (
        <table>
            <thead>
                <tr />
            </thead>
            <tbody>
                <tr>
                    <td className="group">
                        <div className="bank-icon" />
                        <div className="tether-icon" />
                        <span className="main-text" />
                    </td>

                    <td>
                        <span className="main-text" />
                    </td>

                    <td>
                        <span className="main-text" />
                        <span className="secondary-text" />
                    </td>

                    <td>
                        <span className="main-text" />
                        <span className="secondary-text" />
                    </td>

                    <td>
                        <span className="main-text" />
                        <span className="secondary-text" />
                    </td>

                    <td>
                        <span className="main-text" />
                        <span className="secondary-text" />
                    </td>

                    <td>
                        <span className="main-text" />
                        <span className="secondary-text" />
                    </td>

                    <td className="group status">
                        <svg />
                        <span />
                    </td>
                    <div className="confirm-wrapper">
                        <button type="button">{t("Confirm")}</button>
                        <span className="timer">14:59</span>
                    </div>
                </tr>
            </tbody>
        </table>
    );
});
