import React from "react";

export const Group = ({ groupp, group, setAll, setGroup, all }) => {
    return (
        <div
            className={
                groupp.groupId == group && !all
                    ? "schedule__tab-group-name active"
                    : "schedule__tab-group-name"
            }
        >
            <span
                onClick={() => {
                    setAll(false);
                    setGroup(groupp.groupId);
                }}
            >
                {groupp.group}
            </span>
        </div>
    );
};
