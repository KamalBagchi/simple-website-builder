import { registerChaiBlock } from "@chaibuilder/runtime";

import { Component as Box, Config as BoxConfig, BoxProps } from "@/web-blocks/box";
import { Component as Button, Config as ButtonConfig, ButtonProps } from "@/web-blocks/button";
import { Component as CountdownBlock, Config as CountdownBlockConfig, CountdownProps } from "@/web-blocks/countdown";
import { Component as CustomHTML, CustomHTMLBlockProps, Config as CustomHTMLConfig } from "@/web-blocks/custom-html";
import {
  Component as CustomScript,
  CustomScriptBlockProps,
  Config as CustomScriptConfig,
} from "@/web-blocks/custom-script";
import { Component as DividerBlock, Config as DividerBlockConfig, DividerBlockProps } from "@/web-blocks/divider";
import { Component as EmptyBox, Config as EmptyBoxConfig, EmptyBoxProps } from "@/web-blocks/empty-box";
import { Component as CheckboxBlock, Config as CheckboxBlockConfig, CheckboxProps } from "@/web-blocks/form/checkbox";
import { Component as FormBlock, Config as FormBlockConfig, FormProps } from "@/web-blocks/form/form";
import {
  Component as FormButtonBlock,
  Config as FormButtonBlockConfig,
  FormButtonProps,
} from "@/web-blocks/form/form-button";
import { Component as InputBlock, Config as InputBlockConfig, InputProps } from "@/web-blocks/form/input";
import { Component as LabelBlock, Config as LabelBlockConfig, LabelProps } from "@/web-blocks/form/label";
import { Component as RadioBlock, Config as RadioBlockConfig, RadioProps } from "@/web-blocks/form/radio";
import { Component as SelectBlock, Config as SelectBlockConfig, SelectProps } from "@/web-blocks/form/select";
import { Component as TextAreaBlock, Config as TextAreaBlockConfig, TextAreaProps } from "@/web-blocks/form/textarea";
import { Component as GlobalBlock, Config as GlobalBlockConfig, GlobalBlockProps } from "@/web-blocks/global-block";
import { Component as HeadingBlock, Config as HeadingBlockConfig, HeadingProps } from "@/web-blocks/heading";
import {
  Component as LineBreakBlock,
  Config as LineBreakBlockConfig,
  LineBreakProps,
} from "@/web-blocks/hidden/line-break";
import "@/web-blocks/hidden/table";
import { Component as IconBlock, Config as IconBlockConfig, IconBlockProps } from "@/web-blocks/icon";
import { Component as ImageBlock, Config as ImageBlockConfig, ImageBlockProps } from "@/web-blocks/image";
import { Component as LinkBlock, Config as LinkBlockConfig, LinkBlockProps } from "@/web-blocks/link";
import { Component as ListBlock, Config as ListBlockConfig, ListBlockProps } from "@/web-blocks/list";
import { Component as ListItemBlock, Config as ListItemBlockConfig, ListItemBlockProps } from "@/web-blocks/listitem";
import { Component as ParagraphBlock, Config as ParagraphBlockConfig, ParagraphProps } from "@/web-blocks/paragraph";
import { PartialBlock, PartialBlockConfig, PartialBlockProps } from "@/web-blocks/partial-block";
import {
  Column,
  ColumnConfig,
  ColumnProps,
  Component as Row,
  Config as RowConfig,
  RowProps,
} from "@/web-blocks/row-col";
import { Component as RichTextBlock, Config as RichTextConfig, RichTextProps } from "@/web-blocks/rte";
import { Component as SpanBlock, Config as SpanBlockConfig, SpanProps } from "@/web-blocks/span";
import { Config as LayersConfig, Component as TextBlock, TextBlockProps } from "@/web-blocks/text";
import { Component as VideoBlock, Config as VideoBlockConfig, VideoBlockProps } from "@/web-blocks/video";
import {
  Repeater,
  RepeaterConfig,
  RepeaterEmptyState,
  RepeaterEmptyStateConfig,
  RepeaterEmptyStateProps,
  RepeaterItem,
  RepeaterItemConfig,
  RepeaterItemProps,
  RepeaterProps,
} from "./repeater";
/*
 * Register all web blocks.
 * This function should be called  in places where Builder is rendered or pages are rendered.
 * @returns void
 */
const loadWebBlocks = () => {
  registerChaiBlock<BoxProps>(Box, BoxConfig);
  registerChaiBlock<EmptyBoxProps>(EmptyBox, EmptyBoxConfig);
  registerChaiBlock<ButtonProps>(Button, ButtonConfig);
  registerChaiBlock<CountdownProps>(CountdownBlock, CountdownBlockConfig);
  registerChaiBlock<HeadingProps>(HeadingBlock, HeadingBlockConfig);
  registerChaiBlock<ParagraphProps>(ParagraphBlock, ParagraphBlockConfig);
  registerChaiBlock<SpanProps>(SpanBlock, SpanBlockConfig);
  registerChaiBlock<RichTextProps>(RichTextBlock, RichTextConfig);
  registerChaiBlock<LinkBlockProps>(LinkBlock, LinkBlockConfig);
  registerChaiBlock<ListBlockProps>(ListBlock, ListBlockConfig);
  registerChaiBlock<ListItemBlockProps>(ListItemBlock, ListItemBlockConfig);
  registerChaiBlock<IconBlockProps>(IconBlock, IconBlockConfig);
  registerChaiBlock<ImageBlockProps>(ImageBlock, ImageBlockConfig);
  registerChaiBlock<VideoBlockProps>(VideoBlock, VideoBlockConfig);
  registerChaiBlock<CustomHTMLBlockProps>(CustomHTML, CustomHTMLConfig);
  registerChaiBlock<CustomScriptBlockProps>(CustomScript, CustomScriptConfig);
  registerChaiBlock<TextBlockProps>(TextBlock, LayersConfig);

  // //forms
  registerChaiBlock<FormProps>(FormBlock, FormBlockConfig);
  registerChaiBlock<FormButtonProps>(FormButtonBlock, FormButtonBlockConfig);
  registerChaiBlock<InputProps>(InputBlock, InputBlockConfig);
  registerChaiBlock<CheckboxProps>(CheckboxBlock, CheckboxBlockConfig);
  registerChaiBlock<RadioProps>(RadioBlock, RadioBlockConfig);
  registerChaiBlock<SelectProps>(SelectBlock, SelectBlockConfig);
  registerChaiBlock<TextAreaProps>(TextAreaBlock, TextAreaBlockConfig);
  registerChaiBlock<LabelProps>(LabelBlock, LabelBlockConfig);

  // // hidden
  registerChaiBlock<LineBreakProps>(LineBreakBlock, LineBreakBlockConfig);

  registerChaiBlock<DividerBlockProps>(DividerBlock, DividerBlockConfig);
  // // @ts-ignore
  registerChaiBlock<GlobalBlockProps>(GlobalBlock, GlobalBlockConfig);
  registerChaiBlock<PartialBlockProps>(PartialBlock, PartialBlockConfig);
  registerChaiBlock<RowProps>(Row, RowConfig);
  registerChaiBlock<ColumnProps>(Column, ColumnConfig);
  registerChaiBlock<RepeaterProps>(Repeater, RepeaterConfig);
  registerChaiBlock<RepeaterItemProps>(RepeaterItem, RepeaterItemConfig);
  registerChaiBlock<RepeaterEmptyStateProps>(RepeaterEmptyState, RepeaterEmptyStateConfig);
};

export { loadWebBlocks };
