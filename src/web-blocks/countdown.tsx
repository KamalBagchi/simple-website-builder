import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "@chaibuilder/runtime";
import { ClockIcon } from "@radix-ui/react-icons";
import * as React from "react";

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

const generateCountdownHTML = (
  targetDate: string,
  targetTime: string,
  showDays: boolean,
  showHours: boolean,
  showMinutes: boolean,
  showSeconds: boolean,
  completionMessage: string,
  boxStyles: any,
  numberStyles: any,
  labelStyles: any,
  messageStyles: any,
  containerId: string,
) => {
  const timeUnits = [
    { key: "days", label: "Days", show: showDays },
    { key: "hours", label: "Hours", show: showHours },
    { key: "minutes", label: "Minutes", show: showMinutes },
    { key: "seconds", label: "Seconds", show: showSeconds },
  ];

  const visibleUnits = timeUnits.filter((unit) => unit.show);

  // Helper to convert style object to inline attributes
  const styleToAttrs = (styleObj: any) => {
    if (!styleObj) return "";
    const attrs: string[] = [];
    if (styleObj.className) attrs.push(`class="${styleObj.className}"`);
    if (styleObj.style) {
      const styleStr = Object.entries(styleObj.style)
        .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${value}`)
        .join(";");
      if (styleStr) attrs.push(`style="${styleStr}"`);
    }
    return attrs.join(" ");
  };

  return `
    <div id="${containerId}" style="display: contents;">
      ${visibleUnits
        .map(
          (unit) => `
      <div ${styleToAttrs(boxStyles)} data-unit="${unit.key}">
        <div ${styleToAttrs(numberStyles)} data-value="${unit.key}">00</div>
        <div ${styleToAttrs(labelStyles)}>${unit.label}</div>
      </div>
    `,
        )
        .join("")}
      <div ${styleToAttrs(messageStyles)} style="display: none;" data-message="complete"></div>
    </div>
    <script>
      (function() {
        var containerId = '${containerId}';
        var container = document.getElementById(containerId);
        
        if (!container) {
          // Try to find it after a brief delay if not immediately available
          setTimeout(function() {
            container = document.getElementById(containerId);
            if (container) initCountdown();
          }, 100);
          return;
        }
        
        initCountdown();
        
        function initCountdown() {
          var units = container.querySelectorAll('[data-unit]');
          var messageEl = container.querySelector('[data-message="complete"]');
          
          if (units.length === 0) return;
          
          var targetDate = '${targetDate}';
          var targetTime = '${targetTime}';
          var completionMessage = ${JSON.stringify(completionMessage)};
          
          function formatNumber(num) {
            return num.toString().padStart(2, '0');
          }
          
          function calculateTimeLeft() {
            var target = new Date(targetDate + 'T' + targetTime).getTime();
            var now = new Date().getTime();
            var difference = target - now;
            
            if (difference <= 0) {
              return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                completed: true
              };
            }
            
            return {
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
              completed: false
            };
          }
          
          function updateCountdown() {
            var timeLeft = calculateTimeLeft();
            
            if (timeLeft.completed) {
              for (var i = 0; i < units.length; i++) {
                units[i].style.display = 'none';
              }
              if (messageEl) {
                messageEl.textContent = completionMessage;
                messageEl.style.display = 'block';
              }
              return true;
            }
            
            ${visibleUnits
              .map(
                (unit) => `
            var ${unit.key}El = container.querySelector('[data-value="${unit.key}"]');
            if (${unit.key}El) ${unit.key}El.textContent = formatNumber(timeLeft.${unit.key});
            `,
              )
              .join("")}
            
            return false;
          }
          
          updateCountdown();
          var timer = setInterval(function() {
            if (updateCountdown()) {
              clearInterval(timer);
            }
          }, 1000);
        }
      })();
    </script>
  `;
};

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

  const containerId = `countdown-${blockProps.id || Math.random().toString(36).substr(2, 9)}`;

  const htmlContent = generateCountdownHTML(
    targetDate,
    targetTime,
    showDays,
    showHours,
    showMinutes,
    showSeconds,
    completionMessage,
    boxStyles,
    numberStyles,
    labelStyles,
    messageStyles,
    containerId,
  );

  return inBuilder ? (
    <div className="relative">
      {React.createElement("div", {
        ...blockProps,
        ...styles,
        className: "absolute z-20 h-full w-full",
      })}
      {React.createElement("div", {
        ...styles,
        dangerouslySetInnerHTML: { __html: htmlContent.replace(/<script.*?>.*?<\/script>/gs, "") },
      })}
      {completionMessage && (
        <div className="mt-4 w-full border-t border-dashed border-muted-foreground/30 pt-4">
          <div className="mb-2 text-center text-xs text-muted-foreground">Completion Message Preview:</div>
          <div {...messageStyles}>{completionMessage}</div>
        </div>
      )}
    </div>
  ) : (
    React.createElement("div", {
      ...blockProps,
      ...styles,
      dangerouslySetInnerHTML: { __html: htmlContent },
    })
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
