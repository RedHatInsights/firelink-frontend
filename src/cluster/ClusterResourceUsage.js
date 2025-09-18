import React from "react";
import {
  Progress,
  ProgressMeasureLocation,
  Skeleton,
} from "@patternfly/react-core";

const ClusterResourceUsage = ({ data, resourceType }) => {
  if (!data) {
    return <Skeleton height="20px" width="100%" />;
  }

  return (
    <Progress
      value={data.value * 100}
      title={`${resourceType} Usage`}
      measureLocation={ProgressMeasureLocation.outside}
    />
  );
};

export default ClusterResourceUsage;
