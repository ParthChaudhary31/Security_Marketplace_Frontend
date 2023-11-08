import React, { useEffect, useState } from "react";
import CommonModal from "../CommonModal/CommonModal";
import "./PatronModal.scss";
import { viewPostForArbitor } from "../../../Api/Actions/user.action";
import { useSelector } from "react-redux";
import moment from "moment";
import { baseUrlReport } from "../../../Constant";

const PatronModal = ({ show, onHide, item }) => {
  const [data, setData] = useState<any>([]);
  const userEmail = useSelector(
    (state: any) => state?.userDataSlice.emailAddress
  );
  const convertEpochToDate = (epochTimestamp: number) => {
    return moment.unix(Number(epochTimestamp / 1000)).format("DD/MM/YYYY");
  };
  const viewForArbitor = async () => {
    const postID = item?.postID;
    const patron = item?.emailAddress;
    try {
      const result: any = await viewPostForArbitor({
        emailAddress: userEmail,
        postID: postID,
        patron: patron,
      });
      if (result?.status === 200) {
        setData(result?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (show) viewForArbitor();
  }, [show]);
  return (
    <>
      {show ? (
        !data.length ? (
          <CommonModal
            heading={<>&nbsp;</>}
            show={show}
            onHide={onHide}
            className="patron_modal"
            crossBtn
          >
            <div className="d-flex justify-content-center my-5">
              <h3 className="text-dark text-center">No data available</h3>
            </div>
          </CommonModal>
        ) : (
          <CommonModal
            heading={<>&nbsp;</>}
            show={show}
            onHide={onHide}
            className="patron_modal"
            crossBtn
          >
            <ul>
              <li>
                <h4>
                  {data[0]?.firstName} {data[0]?.lastName}
                </h4>
                <p>{data[0]?.description}</p>
              </li>
              <li>
                <h4>Auditor’s Deliverable</h4>
                <p>{convertEpochToDate(data[0]?.estimatedDelivery)}</p>
              </li>
              <li>
                <h4>Patron’s Complain</h4>
                <p>{data[0]?.reason}</p>
              </li>
              <li>
                <h4>Auditor’s submitted report’s link</h4>
                <a
                  href={baseUrlReport + data[0]?.submit}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </li>
            </ul>
          </CommonModal>
        )
      ) : null}
    </>
  );
};

export default PatronModal;
