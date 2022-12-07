import axios from 'axios';

export class GroupManager {
  // get list groupRole
  getListGroup = () => {
    return axios
      .get('/api/v1/site-manager/groups?SiteId=1')
      .then((res) => res)
      .catch((err) => err);
  };

  // get group by id
  getGroupByID = (groupID: string) => {
    return axios
      .get(`/api/v1/site-manager/groups/${groupID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create groupRole
  createGroup = (group: any) => {
    const data = {
      name: group.name,
      personalRate: group.personalRate,
      partnerRate: group.partnerRate
    };
    return axios
      .post('/api/v1/site-manager/group-roles', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // update group
  updateGroupRole = (group: any) => {
    console.log(group);
    const data = {
      id: group.id,
      name: group.name,
      personalRate: group.personalRate,
      partnerRate: group.partnerRate
    };

    return axios
      .put('/api/v1/site-manager/group-roles', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // delete groupRole
  deleteGroup = (groupID: string) => {
    return axios
      .delete(`/api/v1/site-manager/group-roles/${groupID}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageGroup = new GroupManager();
