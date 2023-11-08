import { Container, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./Voting.scss";
import CustomTable from "../../../Common/Table/Index";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import PatronModal from "../../../Common/PatronModal/PatronModal";
import VoteArbiterModal from "../../../Common/VoteModal/VoteArbiterModal";
import CustomPagination from "../../../Common/CustomPagination/CustomPagination";
import { useSelector } from "react-redux";
import {
  arbitorVoting,
  tableListing,
  transactionRegister,
} from "../../../../Api/Actions/user.action";
import { voteArbiters } from "../../../../Api/Actions/contract.action";
import store from "../../../../Redux/store";
import toaster from "../../../Common/Toast";
import NoDataFound from "../../../Common/NoDataFound/NoDataFound";
import { WALLET_CONNECTION_REQUIRE } from "../../../../Constants/AlertMessages/ErrorMessages";
import { ARBITOR_VOTE } from "../../../../Constants/TransactionTypes/TransactionTypes";

const Voting = () => {
  const fields = [
    "ID",
    "Project Name",
    "Arbitration Status",
    "Project Link",
    "View",
    "Vote",
  ];
  const fields2 = [
    "ID",
    "Project Name",
    "Arbitration Completed",
    "Project Link",
    "View",
  ];

  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState();
  const [postID, setPostID] = useState<any>();
  const [voterID, setVoterID] = useState<any>();

  const handleClose = () => setShow(false);
  const handleShow = (item: any) => {
    setModalData(item);
    setShow(true);
  };
  const [showNew, setShowNew] = useState(false);
  const handleCloseNew = () => setShowNew(false);
  const handleShowNew = () => setShowNew(true);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [votingTable, setVotingTable] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const walletAddress: any =
    store?.getState().authenticationDataSlice?.walletAddress;
  const emailAddress = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const isWalletConnected = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );
  const isWalletAddres = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  const userEmail = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const limit = 5; // Number of items per page

  const handleTableListing = async (page: number, limit: number) => {
    try {
      const result = await tableListing(emailAddress, page, limit);
      if (result?.status === 200) {
        setVotingTable(result?.data);
        setTotalPages(result?.totalPage);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const handleTableData = (item: any) => {
    setPostID(item?.postID);
    setVoterID(item?.voteID);
  };

  useEffect(() => {
    handleTableListing(page, limit);
  }, [page, limit]);

  const handlePageChange = (selected: any) => {
    setPage(selected.selected + 1);
  };

  const isVoteStatus = votingTable
    ?.filter((post) => {
      return post?.arbitersList;
    })
    ?.map((post) => {
      return {
        postID: post?.postID,
        vote: post?.arbitersList?.some(
          (arbiter: any) =>
            arbiter?.arbiter === isWalletAddres && arbiter?.vote === true
        ),
      };
    });

  const voteArbiter = async (voterID: number, option: string) => {
    const WalletAddress = walletAddress;
    const votingType = option;
    return await voteArbiters(voterID, votingType, WalletAddress);
  };
  const transactionRegisterForArbitorVote = async () => {
    try {
      const time = Date.now().toString();
      const txnHashForArbitorVote =
        store.getState().userDataSlice?.transactionHashForArbitorVote;

      const result: any = await transactionRegister(
        userEmail,
        txnHashForArbitorVote?.toString(),
        time,
        ARBITOR_VOTE
      );
      if (result?.status === 200) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVoting = async (
    votes: boolean,
    option: string,
    voterId: number
  ) => {
    let res: any;
    const vote = votes;
    try {
      res = await voteArbiter(voterID, option);
      await arbitorVoting(emailAddress, postID, vote, voterId);
      await handleTableListing(page, limit);
      await transactionRegisterForArbitorVote();
    } catch (error) {
      console.error(error);
    }
    return res;
  };

  const checkWalletStatusForVoting = () => {
    if (isWalletConnected) {
      handleShowNew();
    } else {
      toaster.error(WALLET_CONNECTION_REQUIRE);
    }
  };

  const checkUserVoted = () => {
    if (isWalletConnected) {
      toaster.error("you have already voted.");
    }
  };

  return (
    <>
      {/* ------------Voting Page Starts------------ */}
      <section className="voting_sec">
        <Container fluid>
          <h4 className="common-heading">Voting</h4>
          <Row>
            {activeFilter === "pending" && (
              <CustomTable fields={fields} sortbuttons={true}>
                {votingTable?.length > 0 ? (
                  votingTable?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{item?.postID}</td>
                      <td className="text-start">
                        {item?.firstName} {item?.lastName}
                      </td>
                      <td className="text-start">
                        <div className="arbit_sec">
                          <ul>
                            {item.voteCount > 0
                              ? Array.from({ length: 5 }, (_, liIndex) => (
                                  <li
                                    key={liIndex}
                                    style={{
                                      backgroundColor:
                                        liIndex < item.voteCount
                                          ? "#1bb401"
                                          : "#bfbfbf",
                                    }}
                                  ></li>
                                ))
                              : Array.from({ length: 5 }, (_, liIndex) => (
                                  <li key={liIndex}></li>
                                ))}
                          </ul>
                        </div>
                      </td>
                      <td>
                        <a
                          href={item?.gitHub}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      </td>
                      <td className="text-start">
                        <ButtonCustom
                          title="View"
                          type="submit"
                          className="view_btn"
                          onClick={() => handleShow(item)}
                        />
                      </td>
                      <td>
                        <ButtonCustom
                          title={
                            isVoteStatus?.some(
                              (vote) =>
                                vote?.postID === item?.postID && vote?.vote
                            )
                              ? "Voted"
                              : "Vote"
                          }
                          type="submit"
                          className="vote_btn bordered"
                          onClick={() => {
                            const userVoteStatus = isVoteStatus?.find(
                              (vote) => vote?.postID === item?.postID
                            );
                            userVoteStatus && userVoteStatus?.vote
                              ? checkUserVoted()
                              : checkWalletStatusForVoting();
                            handleTableData(item);
                          }}
                        />

                        <VoteArbiterModal
                          show={showNew}
                          onHide={handleCloseNew}
                          handleVoting={handleVoting}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={fields.length} style={{ textAlign: "center" }}>
                      <NoDataFound />
                    </td>
                  </tr>
                )}
              </CustomTable>
            )}

            {activeFilter === "completed" && (
              <CustomTable fields={fields2} sortbuttons={true}>
                {votingTable?.length > 0 ? (
                  votingTable?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{item?.postID}</td>
                      <td className="text-start">
                        {item?.firstName} {item?.lastName}
                      </td>
                      <td className="text-start">
                        <div className="arbit_sec">
                          <ul>
                            {item.voteCount > 0
                              ? Array.from({ length: 5 }, (_, liIndex) => (
                                  <li
                                    key={liIndex}
                                    style={{
                                      backgroundColor:
                                        liIndex < item.voteCount
                                          ? "#1bb401"
                                          : "#bfbfbf",
                                    }}
                                  ></li>
                                ))
                              : null}
                          </ul>
                        </div>
                      </td>
                      <td>
                        <a
                          href={item?.gitHub}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      </td>
                      <td className="text-start text_red">
                        <ButtonCustom
                          title="View"
                          type="submit"
                          className="view_btn"
                          onClick={() => handleShow(item)}
                        />
                      </td>
                      <PatronModal
                        show={show}
                        onHide={handleClose}
                        item={item}
                      />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={fields2.length} className="text-center">
                      <NoDataFound />
                    </td>
                  </tr>
                )}
              </CustomTable>
            )}

            {votingTable?.length > 0 && (
              <>
                {activeFilter === "pending" && (
                  <CustomPagination
                    activePageNumber={page - 1}
                    className="dashboard-pagination"
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                  />
                )}

                {activeFilter === "completed" && (
                  <CustomPagination
                    activePageNumber={page - 1}
                    className="dashboard-pagination"
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </Row>
        </Container>
      </section>
      {/* ------------Voting Page Ends------------ */}
      <PatronModal show={show} onHide={handleClose} item={modalData} />
    </>
  );
};

export default Voting;
