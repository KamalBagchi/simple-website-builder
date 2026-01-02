import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "@chaibuilder/runtime";
import { ClockIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export type CountdownProps = {
  targetDate: string;
  targetTime: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  completionMessage: string;
  boxStyles: ChaiStyles;
  numberStyles: ChaiStyles;
  labelStyles: ChaiStyles;
  messageStyles: ChaiStyles;
  styles: ChaiStyles;
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const Component = (props: ChaiBlockComponentProps<CountdownProps>) => {
  const {
    blockProps,
    targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    targetTime = "00:00",
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    completionMessage = "Time's up!",
    boxStyles,
    numberStyles,
    labelStyles,
    messageStyles,
    styles,
    inBuilder,
  } = props;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    completed: false,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const target = new Date(`${targetDate}T${targetTime}`).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          completed: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        completed: false,
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  if (timeLeft.completed) {
    return (
      <div {...blockProps} {...styles}>
        <div {...messageStyles}>{completionMessage}</div>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days", show: showDays },
    { value: timeLeft.hours, label: "Hours", show: showHours },
    { value: timeLeft.minutes, label: "Minutes", show: showMinutes },
    { value: timeLeft.seconds, label: "Seconds", show: showSeconds },
  ];

  return (
    <div {...blockProps} {...styles}>
      {timeUnits
        .filter((unit) => unit.show)
        .map((unit) => (
          <div key={unit.label} {...boxStyles}>
            <div {...numberStyles}>{formatNumber(unit.value)}</div>
            <div {...labelStyles}>{unit.label}</div>
          </div>
        ))}
      {inBuilder && completionMessage && (
        <div className="mt-4 w-full border-t border-dashed border-muted-foreground/30 pt-4">
          <div className="mb-2 text-center text-xs text-muted-foreground">Completion Message Preview:</div>
          <div {...messageStyles}>{completionMessage}</div>
        </div>
      )}
    </div>
  );
};

const Config = {
  type: "Countdown",
  description: "A customizable countdown timer block",
  label: "Countdown Timer",
  category: "core",
  icon: ClockIcon,
  group: "basic",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("flex gap-2 md:gap-4 justify-center items-center flex-wrap py-4 md:py-6"),
      targetDate: {
        type: "string",
        title: "Target Date",
        default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        ui: { "ui:widget": "date" },
      },
      targetTime: {
        type: "string",
        title: "Target Time",
        default: "00:00",
        ui: { "ui:widget": "time" },
      },
      showDays: {
        type: "boolean",
        title: "Show Days",
        default: true,
      },
      showHours: {
        type: "boolean",
        title: "Show Hours",
        default: true,
      },
      showMinutes: {
        type: "boolean",
        title: "Show Minutes",
        default: true,
      },
      showSeconds: {
        type: "boolean",
        title: "Show Seconds",
        default: true,
      },
      completionMessage: {
        type: "string",
        title: "Completion Message",
        default: "Time's up!",
      },
      boxStyles: StylesProp(
        "flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg md:rounded-xl p-3 md:p-6 min-w-[70px] md:min-w-[100px] shadow-lg backdrop-blur-sm",
      ),
      numberStyles: StylesProp("text-2xl md:text-5xl font-bold text-primary mb-1 md:mb-2"),
      labelStyles: StylesProp("text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider"),
      messageStyles: StylesProp(
        "text-2xl md:text-4xl font-bold text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center",
      ),
    },
  }),
  canAcceptBlock: () => false,
};

export { Component, Config };
