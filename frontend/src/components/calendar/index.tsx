import moment from "moment";
import { useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import calendarIterator from "../../utils/calendar.iterator";
import { useDispatch, useSelector } from "react-redux";

export default function Calendar({ onHide }: any) {
  const [date, setDate] = useState(moment().startOf("month"));
  const { order } = useSelector((state: any) => state.store);
  const [newOrder, setNewOrder] = useState(order);
  const arr = calendarIterator(date);
  const dispatch = useDispatch();

  return (
    <>
      <div className="p-3 d-flex justify-content-between w-50 m-auto">
        <Button
          variant="secondary"
          onClick={() => setDate((prev) => prev.clone().subtract(1, "M"))}
        >
          {"<<"}
        </Button>
        <div className="align-self-center">
          {date.clone().format("MMMM YYYY")}
        </div>
        <Button
          variant="secondary"
          onClick={() => setDate((prev) => prev.clone().add(1, "M"))}
        >
          {">>"}
        </Button>
      </div>
      <Container style={{ width: "max-content" }} className="p-4">
        {arr.map((el, id) => (
          <Row key={id}>
            {el.map((i, index) => (
              <Button
                key={index}
                style={{ width: "50px", height: "50px" }}
                className="d-flex justify-content-center align-items-center col-auto m-1"
                variant="outline-primary"
                {...(Number(i) && {
                  active:
                    date.clone().set("D", i).isSameOrAfter(newOrder.from) &&
                    date.clone().set("D", i).isSameOrBefore(newOrder.to),

                  onClick: () => {
                    let dateSet = date.clone().set("D", i);
                    let result = { ...newOrder };
                    if (newOrder.from.isSame(newOrder.to)) {
                      if (dateSet.isAfter(newOrder.from)) {
                        result.to = dateSet;
                      } else if (dateSet.isBefore(newOrder.from)) {
                        result.from = dateSet;
                      }
                    } else {
                      result = { from: dateSet, to: dateSet };
                    }
                    setNewOrder(result);
                  },
                })}
              >
                {i}
              </Button>
            ))}
          </Row>
        ))}
        <div className="d-flex justify-content-center mt-4">
          <Button
            onClick={() => {
              dispatch({ type: "ORDER", payload: newOrder });
              onHide();
            }}
          >
            Выбрать
          </Button>
        </div>
      </Container>
    </>
  );
}
