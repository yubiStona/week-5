import { useState } from "react";
interface Props {
  items: string[];
  heading: string;
  onSelectItem: (items: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  const message = items.length === 0 && <p>No items found</p>;
  const [selectedIndex, setSelected] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {message}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelected(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;

