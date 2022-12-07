import axios from 'axios';

export class GroupRoleManager {
  // get list groupRole
  getListGroupRole = () => {
    return axios
      .get('/api/v1/site-manager/group-roles')
      .then((res) => res)
      .catch((err) => err);
  };

  // get groupRole by id
  getGroupRoleByID = (groupRoleID: string) => {
    return axios
      .get(`api/v1/site-manager/group-roles/${groupRoleID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create groupRole
  createGroupRole = (groupRole: any) => {
    const data = {
      name: groupRole.name,
      personalRate: groupRole.personalRate,
      partnerRate: groupRole.partnerRate
    };
    return axios
      .post('/api/v1/site-manager/group-roles', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // update groupRole
  updateGroupRole = (groupRole: any) => {
    console.log(groupRole);
    const data = {
      id: groupRole.id,
      name: groupRole.name,
      personalRate: groupRole.personalRate,
      partnerRate: groupRole.partnerRate
    };

    return axios
      .put('/api/v1/site-manager/group-roles', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // delete groupRole
  deleteGroupRole = (groupRoleID: string) => {
    return axios
      .delete(`/api/v1/site-manager/group-roles/${groupRoleID}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageGroupRole = new GroupRoleManager();
