import React, { useEffect, useRef } from "react";
import { useState } from "react";
import io from "socket.io-client";
import {
	Button,
	Grid,
	GridItem
} from '@patternfly/react-core';
import {
	Modal,
	ModalVariant
} from '@patternfly/react-core/deprecated';
import { Spinner } from "@patternfly/react-core";
import CheckCircle from "@patternfly/react-icons/dist/js/icons/check-circle-icon";
import TimesCircle from "@patternfly/react-icons/dist/js/icons/times-circle-icon";
import InfoCircle from "@patternfly/react-icons/dist/js/icons/info-circle-icon";
import { useSelector, useDispatch } from "react-redux";
import { getDeploymentOptions } from "../store/AppDeploySlice";
import { clearNamespaces } from "../store/ListSlice";

const DEPLOY_EVENT = "deploy-app";
const ERROR_EVENT = "error-deploy-app";
const MONITOR_EVENT = "monitor-deploy-app";
const END_EVENT = "end-deploy-app";
const TIMEOUT = 60000; // 60 seconds timeout

// Construct the WebSocket URL based on the current location
const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const host = window.location.host;
const SERVER = `${protocol}${host}`;

const ResponseEntry = ({ response }) => {
  const interpolateLink = (text, consoleUrl) => {
    // Regular expression to find the pattern 'ephemeral-??????'
    const pattern = /ephemeral-\w{6}/;

    // Replace the found pattern with the interpolated link
    return text.replace(pattern, (match) => {
      return `<a href="/namespace/describe/${match}">${match}</a>`;
    });
  };

  return <div dangerouslySetInnerHTML={{ __html: interpolateLink(response) }} />
};

export default function AppDeployModal({
  buttonLabel,
  disabled,
  buttonVariant,
}) {
  const dispatch = useDispatch();

  const deploymentOptions = useSelector(getDeploymentOptions);
  const initialResponse = { message: "Initiating deployment connection..." };

  const [showModal, setShowModal] = useState(false);
  const [canCloseModal, setCanCloseModal] = useState(false);
  const [wsResponses, setWsResponses] = useState([initialResponse]);
  let timeoutActive = useRef(false);
  let socket = useRef(null);

  useEffect(() => {
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [socket]);

  const Deploy = () => {
    setWsResponses([initialResponse]);
    timeoutActive.current = true;

    if (socket.current) {
      socket.current.disconnect();
    }

    socket.current = io(SERVER, {
      path: "/api/firelink/socket.io",
      transports: ["polling"],
    });

    const timeout = setTimeout(() => {
      if (timeoutActive.current) {
        setWsResponses((state) => [
          ...state,
          {
            message:
              "Error: Server is unresponsive. Try again or contact DevProd.",
          },
        ]);
        setCanCloseModal(true);
        socket.current.disconnect();
      }
    }, TIMEOUT);

    socket.current.on(MONITOR_EVENT, (response) => {
      timeoutActive.current = false;
      setWsResponses((state) => [...state, response]);
    });

    socket.current.on(ERROR_EVENT, (response) => {
      timeoutActive.current = false;
      setWsResponses((state) => [...state, response]);
      setCanCloseModal(true);
      socket.disconnect();
    });

    socket.current.on(END_EVENT, (response) => {
      timeoutActive.current = false;
      setWsResponses((state) => [...state, response]);
      setCanCloseModal(true);
      socket.current.disconnect();
    });

    socket.current.on("disconnect", () => {
      clearTimeout(timeout); // Ensure the timeout is cleared when the socket disconnects
    });

    console.log(deploymentOptions);
    socket.current.emit(DEPLOY_EVENT, deploymentOptions);
    setShowModal(true);
  };

  const StatusIcon = ({ index, response }) => {
    if (index === wsResponses.length - 1 && !canCloseModal) {
      return <Spinner size="md" />;
    }
    if (response.error === true) {
      return <TimesCircle style={{ color: "var(--pf-t--global--color--nonstatus--red--default)" }} />;
    }
    if (response.completed === true) {
      return <CheckCircle style={{ color: "var(--pf-t--global--color--nonstatus--green--default)" }} />;
    }
    return <InfoCircle style={{ color: "var(--pf-t--global--color--nonstatus--blue--default)" }} />;
  };

  const close = () => {
    setShowModal(false);
    timeoutActive.current = false; // Ensure the timeout is disabled when the modal is closed
    dispatch(clearNamespaces());
  };

  const getButtonLabel = () => {
    return buttonLabel || "Deploy";
  };

  const getButtonVariant = () => {
    return buttonVariant || "primary";
  };

  return (
    <React.Fragment>
      <Modal
        variant={ModalVariant.small}
        title="Deploying..."
        isOpen={showModal}
        showClose={canCloseModal}
        onClose={close}
        actions={[
          <Button key="cancel" onClick={close}>
            Close
          </Button>,
        ]}
      >
        <div style={{ height: "14rem", overflow: "auto" }}>
          <ul>
            {wsResponses.map((response, index) => (
              <Grid hasGutter>
                <GridItem span={1}>
                  <StatusIcon index={index} response={response} />
                </GridItem>
                <GridItem span={11}>
                  <ResponseEntry response={response.message} />
                </GridItem>
              </Grid>
            ))}
          </ul>
        </div>
      </Modal>
      <Button
        onClick={Deploy}
        isDisabled={disabled}
        variant={getButtonVariant()}
      >
        {getButtonLabel()}
      </Button>
    </React.Fragment>
  );
}
