import { useState, useEffect } from 'react';
import {formatTimerString} from "../utils";

/**
 * Хук для создания таймера обратного отсчета.
 *
 * @param startTimeStr Строка начала события в формате ISO, например, "2024-02-18T22:50:25.287062Z".
 * @param durationStr Длительность таймера в секундах от момента startTime.
 * @param onExpire Callback функция, вызываемая при истечении времени таймера.
 */
const useCountdown = (startTimeStr: string, durationStr: string, onExpire: () => void) => {
  const isoToSeconds = (isoStr: string) => {
    return Math.floor(new Date(isoStr).getTime() / 1000);
  };

  const durationToSeconds = (durationStr: string) => {
    const [hours, minutes, seconds] = durationStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const calculateRemainingTime = () => {
    const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
    const startTime = isoToSeconds(startTimeStr); // Преобразуем startTime из ISO строки в секунды
    const duration = durationToSeconds(durationStr); // Преобразуем duration из строки в секунды
    const endTime = startTime + duration; // Время окончания
    const remainingTime = endTime - currentTime; // Оставшееся время до окончания
    return remainingTime > 0 ? remainingTime : 0; // Если время истекло, возвращаем 0
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  useEffect(() => {
    setRemainingTime(calculateRemainingTime());
  }, [startTimeStr, durationStr]);

  useEffect(() => {
    if (remainingTime <= 0) {
      onExpire();
      return;
    }

    // Обновляем оставшееся время каждую секунду
    const intervalId = setInterval(() => {
      setRemainingTime(calculateRemainingTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime, onExpire]);

  return formatTimerString(remainingTime);
};

export default useCountdown;
