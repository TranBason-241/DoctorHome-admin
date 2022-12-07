import { Paper, PaperProps, Typography } from '@material-ui/core';
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

interface SearchNotFoundProps extends PaperProps {
  searchQuery?: string;
}

export default function SearchNotFound({ searchQuery = '', ...other }: SearchNotFoundProps) {
  const { translate } = useLocales();
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {translate('Status.notFound')}
      </Typography>
      <Typography variant="body2" align="center">
        {translate('Status.netFoundMess')} &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. {translate('Status.tryChecking')}.
      </Typography>
    </Paper>
  );
}
