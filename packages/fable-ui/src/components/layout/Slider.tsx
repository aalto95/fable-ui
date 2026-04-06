import { useEffect, useState } from "react";
import type { ISliderComponent } from "@/models/interfaces/component";
import { BaseField } from "../ui/field";
import { BaseLabel } from "../ui/label";
import { BaseSlider } from "../ui/slider";

export type TSliderProps = Exclude<ISliderComponent, "type">;

export const Slider: React.FC<TSliderProps> = ({
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  valueSuffix = "",
}) => {
  const [value, setValue] = useState<number[]>(
    defaultValue ? [defaultValue] : [min],
  );

  useEffect(() => {
    setValue(defaultValue ? [defaultValue] : [min]);
  }, [defaultValue]);

  return (
    <BaseField>
      <span className="flex w-full text-sm gap-2">
        {label && <BaseLabel htmlFor={name}>{label}</BaseLabel>}
        {value.map((v) => v + valueSuffix)}
      </span>
      <BaseSlider
        id={name}
        name={name}
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(value) => {
          setValue(value);
        }}
      />
      <span className="flex w-full text-sm justify-between">
        <div>
          {min}
          {valueSuffix}
        </div>
        <div>
          {max}
          {valueSuffix}
        </div>
      </span>
    </BaseField>
  );
};
