import React, { useEffect, useState } from "react";
import {
  Button,
  PageSection,
  Split,
  SplitItem,
  Title,
  TitleSizes,
  Card,
  CardBody,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import TopNodesCard from "./ClusterTopNodes";
import ErrorCard from "../shared/ErrorCard";
import Loading from "../shared/Loading";
import ClusterResourceUsage from "./ClusterResourceUsage";

const ClusterCard = () => {
  const [topNodes, setTopNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cpuUsage, setCpuUsage] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);

  const openshiftConsoleBaseUrl =
  process.env.OPENSHIFT_CONSOLE_BASE_URL ||
  "https://console-openshift-console.apps.crc-eph.r9lp.p1.openshiftapps.com";

  const fetchClusterMemoryUsage = async () => {
    try {
      const response = await fetch("/api/firelink/cluster/memory_usage");
      if (!response.ok) {
        console.log("HTTP error! status: ", response.status);
        throw new Error(
          `Something went wrong loading the cluster memory usage metrics.`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response for memory usage");
      }
      const data = await response.json();
      setMemoryUsage(data);
    } catch (error) {
      console.error("Error fetching cluster memory usage:", error);
      // Don't set memory usage data on error, just log it
      setMemoryUsage(null);
    }
  }

  const fetchClusterCPUUsage = async () => {
    try {
      const response = await fetch("/api/firelink/cluster/cpu_usage");
      if (!response.ok) {
        console.log("HTTP error! status: ", response.status);
        throw new Error(
          `Something went wrong loading the cluster CPU usage metrics.`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response for CPU usage");
      }
      const data = await response.json();
      setCpuUsage(data);
    } catch (error) {
      console.error("Error fetching cluster CPU usage:", error);
      // Don't set CPU usage data on error, just log it
      setCpuUsage(null);
    }
  };

  const fetchTopNodes = async () => {
    try {
      const response = await fetch("/api/firelink/cluster/top_nodes");
      if (!response.ok) {
        console.log("HTTP error! status: ", response.status);
        throw new Error(
          `Something went wrong loading the cluster resource metrics.`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response for top nodes");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching top nodes:", error);
      throw error;
    }
  };

  const loadTopNodes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTopNodes();
      setTopNodes(data);
      // Also retry loading the CPU and memory usage
      await fetchClusterCPUUsage();
      await fetchClusterMemoryUsage();
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const openDashboard = () => {
    window.open(`${openshiftConsoleBaseUrl}/monitoring/dashboards/dashboard-k8s-resources-cluster`, "_blank");
  }

  useEffect(() => {
    const loadAllClusterData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Load all cluster data, but continue even if some fail
        const [topNodesData] = await Promise.allSettled([
          fetchTopNodes(),
          fetchClusterCPUUsage(),
          fetchClusterMemoryUsage(),
        ]);
        
        // Handle top nodes data
        if (topNodesData.status === 'fulfilled') {
          setTopNodes(topNodesData.value);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading cluster data:", error);
        setError("Failed to load cluster metrics. Please check if the backend is running and try again.");
        setIsLoading(false);
      }
    };
    
    loadAllClusterData();
  }, []);

  if (error) {
    return <ErrorCard error={error} onRetry={loadTopNodes} />;
  }

  if (isLoading) {
    return <Loading message="Loading cluster metrics..." />;
  }

  return (
    <React.Fragment>
      <PageSection>
        <Split hasGutter>
          <SplitItem>
            <Title headingLevel="h1" size={TitleSizes["3xl"]}>
              Cluster Metrics
            </Title>
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Button variant="primary" onClick={openDashboard}>
              Dashboard
            </Button>
          </SplitItem>
          <SplitItem>
            <Button variant="primary" onClick={loadTopNodes}>
              Refresh
            </Button>
          </SplitItem>
        </Split>
      </PageSection>
      <PageSection hasOverflowScroll>
        <Card>
          <CardBody>
            <Stack hasGutter>
              <StackItem>
                <ClusterResourceUsage data={cpuUsage} resourceType="CPU" />
              </StackItem>
              <StackItem>
                <ClusterResourceUsage data={memoryUsage} resourceType="RAM" />
              </StackItem>
              <StackItem>
                <TopNodesCard topNodes={topNodes} />
              </StackItem>
            </Stack>
          </CardBody>
        </Card>
      </PageSection>
    </React.Fragment>
  );
};

export default ClusterCard;
