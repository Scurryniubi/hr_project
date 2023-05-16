const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  companyId: state => state.user.companyId,
  userId: state => state.user.userInfo.userId // 用户ID
}
export default getters
