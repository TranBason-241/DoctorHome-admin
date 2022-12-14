import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import calendar from '@iconify/icons-eva/calendar-outline';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';

// lang
import useLocales from 'hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

type ServiceMoreMenuProps = {
  onDelete: VoidFunction;
  diverID: string;
  status: string;
};

export default function PartnerMoreMenu({ onDelete, diverID, status }: ServiceMoreMenuProps) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { translate } = useLocales();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {status != '0' ? (
          <MenuItem onClick={handleClickOpen} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={trash2Outline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary={translate('model.Partner.action.delete')}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        ) : (
          <></>
        )}
        <div>
          <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              {translate('model.Partner.message.dialogTitle')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {' '}
                {translate('model.Partner.message.confirmDelete')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                {translate('model.Partner.action.cancel')}
              </Button>
              <Button
                onClick={(event) => {
                  onDelete();
                  handleClose();
                }}
              >
                {translate('model.Partner.action.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.partner.root}/${paramCase(diverID)}/edit`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={translate('model.Partner.action.detail')}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.partner.root}/${paramCase(diverID)}/manageOrderPartner`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={calendar} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary={translate('model.Partner.action.business')}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
