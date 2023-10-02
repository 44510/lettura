import type { FC } from "react";
import { useEffect, useRef } from "react";
import {
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
import { FeedResItem } from "@/db";
import { DragItem, DropItem, ItemTypes } from "./ItemTypes";
import { ItemView } from "./ItemView";
import { getEmptyImage } from "react-dnd-html5-backend";

const style = {
  cursor: "move",
};

export interface CardProps {
  uuid: string;
  title: string;
  index: number;
  feed: FeedResItem;
  className?: String;
  children?: any;
  arrow?: React.ReactNode;
  isActive: Boolean;
  isExpanded: Boolean;
  folder_uuid: string | null;
  level?: number;
  moveItem: (
    dragItemId: string,
    hoverItemId: string,
    folderUuid: string | null
  ) => void; // 修改moveItem函数签名
  toggleFolder: (uuid: string) => void;
  onHover: (
    a: [dragIndex: number, uuid: string, dragItem: DragItem],
    b: [hoverIndex: number, uuid: string, dropResult: DropItem]
  ) => void;
  onDrop: () => void;
  onMoveIntoFolder: (dragItem: DragItem, dropResult: DropItem) => void;
}

export const TreeViewItem: FC<CardProps> = ({
  uuid,
  title,
  feed,
  index,
  level,
  isActive,
  isExpanded,
  folder_uuid,
  moveItem,
  onHover,
  onMoveIntoFolder,
  toggleFolder,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { index, ...feed, folder_uuid };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end(item, monitor) {
      const dropResult = monitor.getDropResult<DropItem>();
      console.log("%c Line:128 🥃 item", "color:#93c0a4", item);
      console.log("🚀 ~ file: TreeViewItem.tsx:69 ~ end ~ feed:", feed);
      console.log("%c Line:125 🥥 dropResult", "color:#7f2b82", dropResult);

      if (item.uuid && dropResult?.item_type === "folder") {
        console.log(
          `You dropped ${item.title} into ${
            dropResult.title
          }! ${monitor.didDrop()}`
        );
        // onMoveIntoFolder(item, dropResult);
      } else if (monitor.didDrop()) {
        // alert("you move a feed");
        // props.onDrop();
      }
    },
  });

  const [{ handlerId, isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: [ItemTypes.CARD, ItemTypes.BOX],
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        handlerId: monitor.getHandlerId(),
      };
    },
    canDrop: (dragItem: DragItem) => {
      return dragItem.uuid !== uuid;
    },
    hover(item: DragItem & Partial<FeedResItem>, monitor) {
      console.log("hover ==================>>>>>>>>");
      if (!ref.current) {
        console.log(
          "🚀 ~ file: TreeViewItem.tsx:105 ~ hover ~ !ref.current:",
          !ref.current
        );
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      const hoverUuid = uuid;

      console.log(
        "🚀 ~ file: TreeViewItem.tsx:113 ~ hover ~ dragIndex === hoverIndex:",
        dragIndex,
        hoverIndex
      );

      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onHover(
        [dragIndex, item.uuid, item],
        [hoverIndex, hoverUuid, monitor.getDropResult() as DropItem]
      );

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop: (item: DragItem, monitor: DropTargetMonitor) => {
      console.log("%c Line:115 🥑 item", "color:#93c0a4", item);
      console.log(
        "🚀 ~ file: TreeViewItem.tsx:159 ~ monitor:",
        monitor.getDropResult()
      );
      // console.log("%c Line:173 🍷 uuid", "color:#f5ce50", uuid);

      if (item.uuid !== uuid) {
        // moveItem(item.uuid, uuid, folder_uuid); // 传递parentId属性
      }

      return { ...item, index };
    },
  });

  const opacity = isDragging ? 0.3 : 1;
  const isA = isOver && canDrop;

  let backgroundColor = "inherit";
  if (isA) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    // backgroundColor = 'darkkhaki'
  }

  drag(drop(ref));
  // drag(drop(isExpanded ? <div>{children}</div> : null));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  return (
    <>
      <div
        ref={ref}
        style={{ ...style, opacity, backgroundColor }}
        data-handler-uuid={handlerId}
      >
        <ItemView
          index={index}
          uuid={feed.uuid}
          level={level}
          text={feed.title}
          feed={{ ...feed }}
          isActive={isActive}
          isExpanded={isExpanded}
          toggleFolder={toggleFolder}
        />
        {props.children}
      </div>
    </>
  );
};
