import React, {
    memo, useCallback, useEffect, useMemo, useState
} from "react";

interface TimerProps {
    creationTime: string;
    duration: string;
    onExpire?: () => void;
}

const durationToSeconds = (durationStr: string) => {
    const [hours, minutes, seconds] = durationStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

export const Timer = memo((props: TimerProps) => {
    const { creationTime, duration, onExpire } = props;
    const preparedDuration = useMemo(() => durationToSeconds(duration), [duration]);
    const [remainingTime, setRemainingTime] = useState(preparedDuration);

    useEffect(() => {
        const endTime = new Date(creationTime).getTime() + preparedDuration * 1000;
        const intervalId = setInterval(() => {
            const now = new Date().getTime();
            const timeLeft = Math.round((endTime - now) / 1000);

            if (timeLeft <= 0) {
                clearInterval(intervalId);
                onExpire?.();
            } else {
                setRemainingTime(timeLeft);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [creationTime, duration, onExpire, preparedDuration]);

    const formatTime = useCallback((time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    return (
        <span className="br-2 py-1 px-2 br-color">
            {formatTime(remainingTime)}
        </span>
    );
});

export default Timer;
