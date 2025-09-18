import React, { useState, useEffect } from "react";
import {
  SplitItem,
  Title,
  TitleSizes,
  PageSection,
  Split,
  Switch,
} from "@patternfly/react-core";
import Loading from "../shared/Loading";
import NamespaceListTable from "./NamespaceListTable";
import { useSelector, useDispatch } from "react-redux";
import {
  getIsNamespacesEmpty,
  loadNamespaces,
  clearNamespaces,
  getNamespaces,
  loadNamespaceResources,
  getLoading,
  getError,
} from "../store/ListSlice";
import FadeInFadeOut from "../shared/FadeInFadeOut";
import ErrorCard from "../shared/ErrorCard";

function NamespaceList() {
  const dispatch = useDispatch();
  const [showJustMyReservations, setShowJustMyReservations] = useState(false);
  const isNamespacesEmpty = useSelector(getIsNamespacesEmpty);
  const namespaces = useSelector(getNamespaces);
  const loading = useSelector(getLoading);
  const error = useSelector(getError);
  const [showReleaseModal, setShowReleaseModal] = useState(false);

  useEffect(() => {
    dispatch(loadNamespaces());
    dispatch(loadNamespaceResources());
  }, [dispatch]);


  // Auto-refresh functionality removed for now
  // useEffect(() => {
  //   let interval;
  //   if (autoRefresh) {
  //     interval = setInterval(() => {
  //       dispatch(loadNamespaces());
  //       dispatch(loadNamespaceResources());
  //     }, 10000);
  //   }
  //   return () => clearInterval(interval);
  // }, [autoRefresh, dispatch]);

  if (isNamespacesEmpty && showJustMyReservations) {
    setShowJustMyReservations(false);
  }

  const refreshData = () => {
    console.log("Refreshing namespaces and reservations...");
    dispatch(loadNamespaces());
  };

  const releaseNamespace =  async (namespace) => {
    setShowReleaseModal(true);
  
    try {
      const response = await fetch("/api/firelink/namespace/release", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ namespace: namespace }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const resp = await response.json();
  
      if (resp.completed) {
        dispatch(clearNamespaces());
        dispatch(loadNamespaces());
      } else {
        throw new Error(`Error releasing namespace ${namespace}: ${resp.message}`);
      }
    } catch (error) {
      console.error("Error releasing namespace:", error);
      // Handle specific error cases
      if (error.message.includes("HTTP error")) {
        // Handle HTTP errors
        alert(`HTTP error occurred while releasing namespace ${namespace}`);
      } else if (error.message.includes("Error releasing namespace")) {
        // Handle errors from the server response
        alert(error.message);
      } else {
        // Handle generic errors
        alert(`An error occurred while releasing namespace ${namespace}`);
      }
    } finally {
      dispatch(clearNamespaces());
      dispatch(loadNamespaces());
      setShowReleaseModal(false);
    }
  };

  if (loading) {
    return <Loading message="Fetching namespaces and reservations..." />;
  }

  if (showReleaseModal) {
    return <Loading message="Releasing namespace..." />;
  }

  if (error) {
    return (
      <PageSection>
        <ErrorCard error={error} onRetry={() => refreshData()} />
      </PageSection>
    )
  }



  return (
    <React.Fragment>
      <PageSection>
        <Split hasGutter>
          <SplitItem>
            <Title headingLevel="h1" size={TitleSizes["3xl"]}>
              Namespaces
            </Title>
          </SplitItem>
          <SplitItem isFilled></SplitItem>

          <SplitItem>
            <Switch
              id="namespace-list-my-reservations"
              label="My Reservations"
              
              isChecked={showJustMyReservations}
              isReversed
              onChange={() => {
                setShowJustMyReservations(!showJustMyReservations);
              }}
            />
          </SplitItem>

        </Split>
      </PageSection>
      <PageSection hasOverflowScroll={true}>
        {isNamespacesEmpty ? (
          <FadeInFadeOut>
            <div style={{ padding: "2rem" }}>
              <Loading message="Fetching namespaces and reservations..." />
            </div>
          </FadeInFadeOut>
        ) : (
          <NamespaceListTable
            namespaces={namespaces}
            showJustMyReservations={showJustMyReservations}
            onRelease={releaseNamespace}
          />
        )}
      </PageSection>
    </React.Fragment>
  );
}

export default NamespaceList;
